import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import './style/style.scss';

// //! імпортую сервіси
// import MarvelService from './services/MarvelService';

// //! Створюю екземпляр і запускаю методи (для проекту НЕ потрібно)
// const marvelService = new MarvelService();
// marvelService.getAllCharacters().then(res => console.log(res)); //виводжу всіх персонажів
// marvelService.getCharacter(1010699).then(res => console.log(res)); //виводжу один персонаж
// marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(`ID: ${item.id}, Name: ${item.name}`))); //виводжу id і name


ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <React.StrictMode>
            <App />      
        </React.StrictMode>
    )

