import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';

import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])


    //! Оновлення персонажа
    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return; //! Якщо нема ID тоді онновлення зупинятиметься
        }

        clearError();

        //! Якщо ID присутнє тоді роблю запит на сервер
        getCharacter(charId) //! отримую віжповідь з інфою про одного персонажа
            .then(onCharLoaded)
            .then(() => setProcess('confirmed')) //! Використовую FSM
    }

    //! Виношу персонаж для подальшого його використання
    const onCharLoaded = (char) => {
        setChar(char);
    };
   
    return (
        <div className="char__info">
        {/* //! Тут використав FINITE STATE MACHINE */}
            {setContent (process, View, char)}
        </div>
    )
}


const View = ({data}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = data;

    let imageStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
      imageStyle = {'objectFit' : 'contain'};
    }

    return (
        <>
            <div className="char__basics">
                <img 
                src={thumbnail} 
                alt={name}
                style={imageStyle}
                />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>

            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.length > 0 ? (
                        comics.map((item, i) => (
                            <li key={i} className='char__comics-item'>
                                <a href={item.url}>{item.name}</a>
                            </li>
                        ))
                    ) : (
                        <li className='char__comics-item'> Роблю перевірку чи є доступні комікси <br></br> НЕМА ДОСТУПНИХ КОМІКСІВ
                        </li>
                    )
                }
            </ul>
        </>
    )
}

//! Перевірив типізацію через propTypes
CharInfo.propTypes = {
    charId: PropTypes.number,
}

export default CharInfo;

