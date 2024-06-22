import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
from datetime import datetime
from rag_client import invoke_rag_chain

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app, resources={r"/api/*": {"origins": "https://smile2steps-chatbot.netlify.app"}}, supports_credentials=True)

DATABASE = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'chat_app.db')

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# Initialize the database if it does not exist
if not os.path.exists(DATABASE):
    init_db()

def is_logged_in():
    return 'user_id' in session

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password)).fetchone()
    if user:
        session['user_id'] = user['id']
        return jsonify({"success": True, "user": dict(user)}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        childFirstName = data.get('childFirstName')
        childLastName = data.get('childLastName')
        childDob = data.get('childDob')

        db = get_db()
        if db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone():
            return jsonify({"success": False, "message": "Username already exists"}), 400
        else:
            db.execute('INSERT INTO users (username, password, email, first_name, last_name, child_first_name, child_last_name, child_dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    (username, password, email, firstName, lastName, childFirstName, childLastName, childDob))
            db.commit()
            session['user_id'] = db.execute('SELECT last_insert_rowid()').fetchone()[0]
            user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
            return jsonify({"success": True, "user": dict(user)}), 201
    except Exception as e:
        print(f"Signup failed: {e}")
        return jsonify({"success": False, "message": "Signup failed. Please try again."}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True, "message": "Logged out successfully"}), 200

@app.route('/api/update_profile', methods=['PUT'])
def update_profile():
    if not is_logged_in():
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.json
    user_id = session['user_id']

    db = get_db()
    user = db.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    if user:
        db.execute('UPDATE users SET first_name = ?, last_name = ?, child_first_name = ?, child_last_name = ?, child_dob = ?, password = ? WHERE id = ?',
                (data.get('firstName', user['first_name']), data.get('lastName', user['last_name']),
                data.get('childFirstName', user['child_first_name']), data.get('childLastName', user['child_last_name']),
                data.get('childDob', user['child_dob']), data.get('newPassword', user['password']), user_id))
        db.commit()
        user = db.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        return jsonify({"success": True, "user": dict(user)}), 200
    else:
        return jsonify({"success": False, "message": "User not found"}), 404

@app.route('/api/data', methods=['POST'])
def get_data():
    if not is_logged_in():
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    message = request.json.get('message')
    response_message = invoke_rag_chain(message)

    user_id = session['user_id']
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    db = get_db()
    db.execute('INSERT INTO chat_history (username, timestamp, user_message, system_message) VALUES (?, ?, ?, ?)',
            (user_id, timestamp, message, response_message))
    db.commit()

    return jsonify({'message': response_message})

if __name__ == '__main__':
    app.run(debug=True)
