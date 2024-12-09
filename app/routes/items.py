from fastapi import APIRouter
from app.schemas.item import Item

router = APIRouter()

@router.get("/{item_id}")
async def get_items(item_id: int , q: str | None = None ):
    return {"items": item_id , "q": str  }

@router.post("/")
async def create_item(item: Item):
    return {"message": f"Item {item.name} created!", "data": item}
