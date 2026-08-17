"""
CareerDNA AI – Notifications Endpoints
GET  /api/v1/notifications           → Unread notifications list
POST /api/v1/notifications/{id}/read → Mark as read
DELETE /api/v1/notifications/{id}    → Dismiss notification
"""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import NotificationItem, NotificationListResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])
logger = logging.getLogger("careerdna.notifications")


def _row_to_item(row: dict) -> NotificationItem:
    created = row.get("created_at", datetime.now(timezone.utc))
    if isinstance(created, str):
        created = datetime.fromisoformat(created)
    return NotificationItem(
        notification_id=row["id"],
        title=row.get("title", ""),
        message=row.get("message", ""),
        notification_type=row.get("notification_type", "SYSTEM"),
        is_read=bool(row.get("is_read", False)),
        created_at=created,
    )


@router.get("", response_model=NotificationListResponse)
async def list_notifications(current_user: dict = Depends(get_current_user)):
    """Return all notifications (unread first) for the current user."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    rows = store.find_all("notifications", user_id=user_id)
    # Unread first, then by created_at descending
    rows.sort(key=lambda r: (r.get("is_read", False), str(r.get("created_at", ""))), reverse=False)

    items = [_row_to_item(r) for r in rows]
    unread_count = sum(1 for r in rows if not r.get("is_read", False))

    return NotificationListResponse(notifications=items, unread_count=unread_count)


@router.post("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Mark a notification as read."""
    store = get_demo_store()
    row = store.get_by_id("notifications", notification_id)
    if not row or row.get("user_id") != current_user["user_id"]:
        raise HTTPException(status_code=404, detail="Notification not found.")
    store.update("notifications", notification_id, {"is_read": True})
    return {"message": "Notification marked as read."}


@router.post("/read-all")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read."""
    user_id = current_user["user_id"]
    store = get_demo_store()
    rows = store.find_all("notifications", user_id=user_id)
    for r in rows:
        store.update("notifications", r["id"], {"is_read": True})
    return {"message": f"Marked {len(rows)} notifications as read."}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Dismiss a notification."""
    store = get_demo_store()
    row = store.get_by_id("notifications", notification_id)
    if not row or row.get("user_id") != current_user["user_id"]:
        raise HTTPException(status_code=404, detail="Notification not found.")
    store.delete("notifications", notification_id)
    return {"message": "Notification dismissed."}
