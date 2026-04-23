import logging
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

app = FastAPI(title="Todo API")

# ----- Domain Exceptions -----
class SomeDomainError(Exception):
    """Placeholder for business‑logic specific errors."""
    pass

class ValidationError(HTTPException):
    """Raised for validation errors, maps to HTTP 400."""
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)

# ----- Pydantic Models -----
class TodoBase(BaseModel):
    title: str = Field(..., example="Buy milk")
    description: Optional[str] = Field(None, example="2% milk, 1 litre")
    completed: bool = Field(False, example=False)

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class Todo(TodoBase):
    id: int

# ----- In‑memory storage -----
_todos: Dict[int, Todo] = {}
_next_id: int = 1

def _get_next_id() -> int:
    global _next_id
    current = _next_id
    _next_id += 1
    return current

# ----- CRUD Endpoints -----
@app.get("/todos", response_model=List[Todo])
def list_todos():
    try:
        return list(_todos.values())
    except SomeDomainError as exc:
        raise ValidationError(detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(todo_in: TodoCreate):
    try:
        todo = Todo(id=_get_next_id(), **todo_in.dict())
        _todos[todo.id] = todo
        return todo
    except SomeDomainError as exc:
        raise ValidationError(detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    try:
        todo = _todos.get(todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        return todo
    except SomeDomainError as exc:
        raise ValidationError(detail=str(exc))
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo_in: TodoUpdate):
    try:
        existing = _todos.get(todo_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Todo not found")
        updated_data = todo_in.dict(exclude_unset=True)
        updated = existing.copy(update=updated_data)
        _todos[todo_id] = updated
        return updated
    except SomeDomainError as exc:
        raise ValidationError(detail=str(exc))
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    try:
        if todo_id not in _todos:
            raise HTTPException(status_code=404, detail="Todo not found")
        del _todos[todo_id]
        return Response(status_code=204)
    except SomeDomainError as exc:
        raise ValidationError(detail=str(exc))
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="Internal server error")
