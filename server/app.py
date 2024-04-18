from flask import Flask, jsonify, request, redirect, url_for, flash, Blueprint
import requests
from models import User, Collection, Game
from config import app, db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user, LoginManager
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity




app.config['JWT_SECRET_KEY'] = 'huntmanjoe'  
jwt = JWTManager(app)
login_manager = LoginManager()
login_manager.init_app(app)
auth_bp = Blueprint('auth', __name__)
@login_manager.user_loader
def load_user(user_id):
    user = User.query.get(int(user_id))
    print("Loaded user:", user)
    return user

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(username=username, email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to register user', 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    print(f"Attempting to log in user: '{username}'")

    if not user:
        print(f"User '{username}' not found")
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password_hash, password):
        print(f"Invalid password for user '{username}'")
        return jsonify({'error': 'Incorrect password'}), 401

    login_user(user, remember=True) 
    access_token = create_access_token(identity=user.id)
    print(f"User '{username}' logged in successfully")

    if current_user.is_authenticated:
        print("Current user is authenticated")
    else:
        print("Current user is not authenticated")

    return jsonify(access_token=access_token), 200


@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200


app.register_blueprint(auth_bp)


@app.route('/api/games', methods=['GET'])
def get_games():
    try:
        igdb_url = 'https://api.igdb.com/v4/games'
        headers = {
            'Client-ID': 'lvb93neo1n04h3gcf047pf7m3a28du',
            'Authorization': 'Bearer flbw87k9l94mvlkpg185z6s34skpnn',
            'Accept': 'application/json',
        }
        fields = 'name, cover.url, genres.name, platforms.name, summary'
        response = requests.post(igdb_url, headers=headers, data=f"fields {fields}; limit 18;")
        response.raise_for_status()
        return jsonify(response.json()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/games/top-rated', methods=['GET'])
def get_top_rated_games():
    try:
        fields = 'name, cover.url, genres.name, platforms.name, summary, rating'
        sort = 'rating desc;'

        response = requests.post('https://api.igdb.com/v4/games',
                                 headers={
                                     'Client-ID': 'lvb93neo1n04h3gcf047pf7m3a28du',
                                     'Authorization': 'Bearer flbw87k9l94mvlkpg185z6s34skpnn',
                                     'Accept': 'application/json',
                                 },
                                 data=f"fields {fields}; sort {sort} limit 11;")
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/games/search', methods=['POST'])
def search_games():
    data = request.get_json()
    search_query = data.get('search', '') 

    try:
        igdb_url = 'https://api.igdb.com/v4/games'
        headers = {
            'Client-ID': 'lvb93neo1n04h3gcf047pf7m3a28du',
            'Authorization': 'Bearer flbw87k9l94mvlkpg185z6s34skpnn',
            'Accept': 'application/json',
        }
        fields = 'name, cover.url, genres.name, platforms.name, summary'
        response = requests.post(igdb_url, headers=headers, data=f"fields {fields}; search \"{search_query}\"; limit 100;")
        response.raise_for_status()  
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e: 
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/games/<int:game_id>', methods=['GET'])
def get_game_details(game_id):
    try:
        igdb_url = 'https://api.igdb.com/v4/games'
        headers = {
            'Client-ID': 'lvb93neo1n04h3gcf047pf7m3a28du',
            'Authorization': 'Bearer flbw87k9l94mvlkpg185z6s34skpnn',
            'Accept': 'application/json',
        }
        fields = 'name, cover.url, genres.name, platforms.name, summary'
        response = requests.post(igdb_url, headers=headers, data=f"fields {fields}; where id = {game_id}; limit 1;")
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile/<username>', methods=['GET'])
def get_user_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

 
    user_collections = user.collections.all()

    print("User:", user)
    print("Collections:", user_collections)  

    user_collection = []
    for collection in user_collections:
        game_id = collection.game_id
        user_collection.append(game_id)

    print("User Collection:", user_collection) 

  
    games_info = []
    for game_id in user_collection:
        game_info = fetch_game_info(game_id)
        if game_info:
            games_info.append(game_info)

    user_data = {
        'username': user.username,
        'email': user.email,
        'profile_pic': user.profile_pic,
        'joined': user.created_at.strftime('%Y-%m-%d'),
        'collection': games_info, 
    }

    return jsonify(user_data), 200

def fetch_game_info(game_id):
    try:
        igdb_url = 'https://api.igdb.com/v4/games'
        headers = {
            'Client-ID': 'lvb93neo1n04h3gcf047pf7m3a28du',
            'Authorization': 'Bearer flbw87k9l94mvlkpg185z6s34skpnn',
            'Accept': 'application/json',
        }
        fields = 'name, cover.url, genres.name, platforms.name, summary'
        response = requests.post(igdb_url, headers=headers, data=f"fields {fields}; where id = {game_id}; limit 1;")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching game info for ID {game_id}: {str(e)}")
        return None


@app.route('/api/users/search', methods=['POST'])
def search_users():
    try:
        data = request.get_json()
        search_query = data.get('search', '').lower() 
        users = User.query.filter(User.username.ilike(f"%{search_query}%")).all()
        users_data = [{'username': user.username, 'profile_pic': user.profile_pic} for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        print(f"Server Error: {str(e)}")  
        return jsonify({'error': 'Internal Server Error'}), 500  
    

@app.route('/api/profile/add_to_collection', methods=['POST'])
@jwt_required()
def add_to_collection():
    user_id = get_jwt_identity()
    data = request.get_json(force=True)
    game_id = data.get('gameId')

    if not game_id:
        return jsonify({'error': 'Game ID is required'}), 422

    if Collection.query.filter_by(user_id=user_id, game_id=game_id).first():
        return jsonify({'error': 'Game already in collection'}), 409

    new_collection = Collection(user_id=user_id, game_id=game_id)
    db.session.add(new_collection)
    db.session.commit()

    return jsonify({'message': 'Game added to collection successfully'}), 200


@app.route('/api/profile/<username>/collections', methods=['GET'])
def get_user_collections(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404


    collections = Collection.query.filter_by(user_id=user.id).all()


    user_collections = []
    for collection in collections:
        game = Game.query.get(collection.game_id)
        if game:
            user_collections.append({
                'title': game.title,
                'rating': collection.rating,
       
            })

    return jsonify(user_collections), 200

@app.route('/api/profile/remove_from_collection/<int:game_id>', methods=['DELETE'])
@jwt_required()
def remove_from_collection(game_id):
    user_id = get_jwt_identity()


    collection_entry = Collection.query.filter_by(user_id=user_id, game_id=game_id).first()
    if not collection_entry:
        return jsonify({'error': 'Game not found in collection'}), 404


    db.session.delete(collection_entry)
    db.session.commit()

    return jsonify({'message': 'Game removed from collection successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)