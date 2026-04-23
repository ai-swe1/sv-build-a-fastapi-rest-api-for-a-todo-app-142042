from models import Todo
from datetime import datetime

todo1 = Todo(title='Todo 1', description='This is the first todo', completed=False)
todo2 = Todo(title='Todo 2', description='This is the second todo', completed=False)

todos = [todo1, todo2]

for todo in todos:
    # assuming a session is created and bound to the database
    # session.add(todo)
    # session.commit()