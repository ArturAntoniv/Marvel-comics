import { useHttp } from "../hooks/http.hooks";

const useMarvelService = () => {

	const { request, clearError, process, setProcess } = useHttp(); //! Витягую сутності з хука щоб їх потім використовувати

	//! прописую АРІ посилання для зменшення коду
	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=ce71efa3e67432e3f999b95e9fcd297e'

	const _baseOffset = 210;


	//! Роблю запити до API Marvel, хочу отримати всіх персонажів
	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformCharacter); //! ПЕРЕДАЮ ОБЄКТ (res), ЩОБ ЙОГО ТРАНСФОРМУВАТИ В _transformCharacter. Також через map роблю новий масив з новими обєктами
	}

	//! запити до API Marvel, хочу отримати ОДИН персонаж
	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
		return _transformCharacter(res.data.results[0]); //! ПЕРЕДАЮ ОБЄКТ (res), ЩОБ ЙОГО ТРАНСФОРМУВАТИ В _transformCharacter
	};


//---------------------

	//! Тут витягую персонажа по імені ( можна зробити по будь-якій властивості)
	const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

//---------------------

	const getAllComics = async (offset = 0) => {
		const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformComics);
	};

	const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

//------------------------

	//! Тут метод який обробляє данні API. зменшує код. Тут вся інформація яка потрібна
	const _transformCharacter = (char) => {
		return {

				id: char.id,
				name: char.name,
				description: char.description
					? `${char.description.slice(0, 210)}...`
					: "Сталась якась дупця і опис персонажа відсутній",
				thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
				homepage: char.urls[0].url,
				wiki: char.urls[1].url,
				comics: char.comics.items,

		}
	}


	const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
	};


	return {
		clearError,
		process,
		setProcess,
		getAllCharacters,
		getCharacterByName,
		getCharacter,
		getAllComics,
		getComic,
	};

}

export default useMarvelService;