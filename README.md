# Tic-Tac-Toe Mobile App

A cross-platform Tic-Tac-Toe game built with React Native and Expo, featuring both single-player and multiplayer modes, backed by Firebase for real-time data and authentication.

## 🛠️ Built With
- **React Native**  
- **Expo**  
- **Firebase**  
  - FireStore 
  - Authentication  

## 🎮 Key Features

### Single Player
- Play against a bot  
- Two difficulty levels:
  - **Easy**: Bot chooses any empty cell at random.  
  - **Hard**: Bot uses a simple heuristic:
    1. **Win**: If it has a move that completes three in a row, it takes it.  
    2. **Block**: If the opponent can win next, it blocks that cell.  
    3. **Center**: Takes the center cell if it's free.  
    4. **Random**: Otherwise, picks a random empty cell.

### Multiplayer
- **Create Room**  
  - Generate a unique room code  
  - Share the code with friends to invite them  
- **Join by Code**  
  - Enter a room code to join (only if you’ve been invited)  
- **Random Match**  
  - Automatically joins an available game  
  - If no open rooms exist, creates a new one and joins it  

### User Profile
- Change your avatar and nickname at any time  
- **Login** / **Logout** with Firebase Authentication  

## 📱 Screenshots
<img src="https://github.com/user-attachments/assets/c07589c1-a822-4793-912d-d2ad67286101" width="200" alt="IMG_8713" />  
<img src="https://github.com/user-attachments/assets/91add236-1a54-40c5-b23d-cb71dc62372b" width="200" alt="IMG_8712" />  
<img src="https://github.com/user-attachments/assets/9eac1409-58f8-4d16-aaa3-774bb77a373c" width="200" alt="IMG_8711" />  
<img src="https://github.com/user-attachments/assets/bc7fa13a-16b2-4975-958e-0705f86d7ca2" width="200" alt="IMG_8710" />  
<img src="https://github.com/user-attachments/assets/657edc1a-df4b-4532-8036-9f32d113af3f" width="200" alt="IMG_8709" />  
<img src="https://github.com/user-attachments/assets/dc257b0d-8179-4341-8dab-1c2226dc87a4" width="200" alt="IMG_8708" />  
<img src="https://github.com/user-attachments/assets/cd94d2ee-6885-4cdd-8bc7-63972283efa7" width="200" alt="IMG_8707" />  
<img src="https://github.com/user-attachments/assets/a25f2b29-4178-434c-8eff-518af70ea76b" width="200" alt="IMG_8706" />  








## 🚀 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/tic-tac-toe-mobile.git
   cd tic-tac-toe-mobile
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure Firebase**
  - Create a Firebase project
  - Enable Email/Password auth and FireStore

4. **Run the App**
  ```bash
  expo start
  ```


   
