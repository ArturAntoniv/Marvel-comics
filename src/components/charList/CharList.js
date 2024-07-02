
import React, { useState, useEffect, useRef, useMemo } from "react";
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';


import {CSSTransition, TransitionGroup} from 'react-transition-group';

import './charList.scss';

//! Використовую FSM
const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    //! Використовую ХУК useState
    const [ charList, setCharList ] = useState([]);
    const [ newItemLoading, setNewItemLoading ] = useState(false);
    const [ offset, setOffset ] = useState(210);
    const [ charEnded, setCharEnded ] = useState(false);

    
    //! Отримую данні з API
    const {getAllCharacters, process, setProcess } =  useMarvelService();


    //! Використовую ХУК useEffect
    useEffect(() => {
        onRequest(offset, true);

    //! Нижче коментар який забирає епотрібні попередження
        //eslint-disable-next-line
    }, [])

    
    //! Код ПІДГРУЗКИ нових карток персонажів
   const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true); //! роблю коректну підгрузку НОВИХ персонажів
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed')) //! Використовую FSM
    }

    //! Коли персонажі загрузились. Добавляю до старого списку новий (9 штук). 
    const onCharListLoaded = async(newCharList) => {
        //! Перевіряю коли персонажі зкаінчились і скриваю кнопку
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList([...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset + 9);
        setCharEnded(ended);
    }



    //! Використовую ХУК useRef
    //! Роблю виділення картки при кліці і табом
    const itemRefs = useRef([]);


    const focusOnItem = (id) => {
        // Я реалізував варіант трохи складніше, і з класом, і з фокусом. Але теоретично можна залишити лише фокус, і його у стилях використовувати замість класу. Насправді, рішення з css-класом можна зробити, винісши персонажа. В окремий компонент. Але коду буде більше, з'явиться новий стан і не факт, що ми виграємо по оптимізації за рахунок більшої кількості елементів

        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    //! Цей метод потрібний для оптимізації щоб не поміщати таку конструкцію вв метод render 
    function renderItems(arr) {

        console.log('render');

        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id); //! Тут КЛІК на картинку яка буде відображена зправа
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        //! Це для центрування спінера 
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }


    //! Використовую useMemo щоб не було лишніх перерендерювань
    // було два рендера і ЗНИКЛА підсвітка карточки
    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading );
        
    //! Нижче коментар який забирає епотрібні попередження
        //eslint-disable-next-line
    }, [process]);


    return (
        <div className="char__list">
            {/* //! Використовую FSM */}
            {elements}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}} //! ховаю кнопку якщо персонажі закінчились
                onClick={() => onRequest(offset)}  //! Дозагрузка карточок персонажів 
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;


