import sqlite3
import os

DATABASE = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'chat_app.db')

def query_db(query, args=(), one=False):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    con.close()
    return (rv[0] if rv else None) if one else rv

def print_users():
    print("Users Table:")
    users = query_db("SELECT * FROM users")
    for user in users:
        print(user)

def print_chat_history():
    print("Chat History Table:")
    chat_history = query_db("SELECT * FROM chat_history")
    for chat in chat_history:
        print(chat)

if __name__ == "__main__":
    print_users()
    print_chat_history()
