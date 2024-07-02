import { useState, useCallback} from "react";

//! Тут описаний власний ХУК який може відправляти запити на срвер, обробляти результати і зберігати локальні стани

export const useHttp = () => {

	//! Тут створюю FINITE STATE MACHINE
	const [process, setProcess] = useState('waiting');


	const request = useCallback (async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

		//! Тут створюю FINITE STATE MACHINE
		setProcess('loading');


		try {
			const response = await fetch(url, {method, body, headers});

			if (!response.ok) {
				throw new Error (`Could not fetch ${url}, status: ${response.status}. Сталась якась помилка ${url}, проблема зі статусом ${response.status}`)
			}

			const data = await response.json();
			return data;
			
		} catch(e) {
			//! Тут створюю FINITE STATE MACHINE
			setProcess('error');

			throw e;
		}

	}, []);


	const clearError = useCallback(() => {
		//! Тут створюю FINITE STATE MACHINE
		setProcess('loading');
	}, []);

	return {request, clearError, process, setProcess}
}