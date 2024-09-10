import { useEffect } from 'react';
import './Glosor.css';
import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';

document.addEventListener('DOMContentLoaded', () => {
	const count_input = document.getElementById(
		'count-input'
	) as HTMLInputElement;

	count_input.value = '1';
});

function minimize() {
	appWindow.minimize();
}

function close() {
	appWindow.close();
}

let menuOpen = false;

function menu() {
	const menu = document.getElementById('menu');
	const menu_background = document.getElementById('menu-background');
	const menu_item_titles = document.getElementsByClassName('menu-item-title');
	const menu_icons = document.getElementsByClassName('menu-icon');

	if (menu && menu_background && menu_item_titles && menu_icons && !menuOpen) {
		menu_background.style.display = 'initial';

		setTimeout(() => {
			menu.style.width = '300px';
		}, 100);

		setTimeout(() => {
			for (let i = 0; i < menu_item_titles.length; i++) {
				(menu_item_titles[i] as HTMLElement).style.color = 'white';
			}

			for (let i = 0; i < menu_icons.length; i++) {
				(menu_icons[i] as HTMLElement).style.fill = 'white';
			}
		}, 100);

		menuOpen = true;
	} else if (menu && menu_background && menuOpen) {
		menu.style.width = '0px';

		setTimeout(() => {
			menu_background.style.display = 'none';
		}, 100);

		for (let i = 0; i < menu_item_titles.length; i++) {
			(menu_item_titles[i] as HTMLElement).style.color = 'transparent';
		}

		for (let i = 0; i < menu_icons.length; i++) {
			(menu_icons[i] as HTMLElement).style.fill = 'transparent';
		}

		menuOpen = false;
	}
}

let glosor: string[] = [];
let svar: string[] = [];

listen<{ [key: string]: string[] }>('saved_glosor', (e) => {
	e.payload.glosor.forEach((item) => {
		glosor.push(item);
	});

	e.payload.svar.forEach((item) => {
		svar.push(item);
	});

	const page = document.getElementById('page');

	if (svar.length > 0 && glosor.length > 0) {
		svar.forEach((svaret) => {
			let newSvarInput = document.createElement('input');

			newSvarInput.type = 'text';

			newSvarInput.className = 'svar';

			newSvarInput.addEventListener('keypress', (key) => {
				if (key.code == 'Enter') {
					newSvarInput.blur();
					if (newSvarInput.value.toLowerCase() == svaret.toLowerCase()) {
						console.log('Rätt svar!');
						newSvarInput.disabled = true;
						newSvarInput.style.border = '1px solid rgb(119, 255, 125)';
						newSvarInput.style.userSelect = 'none';
					} else {
						newSvarInput.disabled = true;
						newSvarInput.style.border = '1px solid rgb(255, 91, 91)';
						newSvarInput.style.userSelect = 'none';
					}
				}
			});

			let newGlosaOchSvar = document.createElement('div');

			newGlosaOchSvar.className = 'glosa-och-svar';

			const newGlosa = document.createElement('p');

			newGlosa.className = 'glosa';

			newGlosa.textContent = glosor[svar.indexOf(svaret)];

			page?.appendChild(newGlosaOchSvar);

			newGlosaOchSvar.appendChild(newGlosa);
			newGlosaOchSvar?.appendChild(newSvarInput);
		});
	}
});

function Glosor() {
	let glos_popup: WebviewWindow;

	useEffect(() => {
		if (!glos_popup) {
			glos_popup = new WebviewWindow('glosor', {
				url: '../glosPopup.html',
				center: true,
				focus: true,
				resizable: false,
				decorations: false,
				width: 700,
				height: 500,
				title: 'Glosor',
			});
			glos_popup.once('tauri://created', function () {
				console.log('Successfully created the popup window');
			});

			glos_popup.once('tauri://error', function (e) {
				console.log(e);
			});
		}
	}, []);

	return (
		<main>
			<div id="menu-background">
				<div id="menu">
					<a className="menu-item" href="/">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#e8eaed"
							className="menu-icon"
						>
							<path d="M242.87-202.87H354.5V-400q0-19.15 13.17-32.33Q380.85-445.5 400-445.5h160q19.15 0 32.33 13.17Q605.5-419.15 605.5-400v197.13h111.63v-355.7L480-736.41 242.87-558.57v355.7Zm-91 0v-355.7q0-21.57 9.58-40.87 9.57-19.3 26.72-31.97L425.3-809.26q24.11-18.39 54.7-18.39 30.59 0 54.7 18.39l237.13 177.85q17.15 12.67 26.72 31.97 9.58 19.3 9.58 40.87v355.7q0 37.78-26.61 64.39t-64.39 26.61H563.59q-19.16 0-32.33-13.17-13.17-13.18-13.17-32.33v-200.72h-76.18v200.72q0 19.15-13.17 32.33-13.17 13.17-32.33 13.17H242.87q-37.78 0-64.39-26.61t-26.61-64.39ZM480-469.76Z" />
						</svg>
						<h4 className="menu-item-title">Hem</h4>
					</a>
					<a className="menu-item" href="/glosor">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#e8eaed"
							className="menu-icon"
						>
							<path d="M206.31-194H566v-200h200v-359.69q0-5.39-3.46-8.85t-8.85-3.46H206.31q-5.39 0-8.85 3.46t-3.46 8.85v547.38q0 5.39 3.46 8.85t8.85 3.46Zm0 86q-41.92 0-70.12-28.19Q108-164.39 108-206.31v-547.38q0-41.92 28.19-70.12Q164.39-852 206.31-852h547.38q41.92 0 70.12 28.19Q852-795.61 852-753.69v403.46L609.77-108H206.31Zm85.38-263.77v-86H486v86H291.69Zm0-185.23v-86h376.62v86H291.69ZM194-194V-766v572Z" />
						</svg>
						<h4 className="menu-item-title">Glosor</h4>
					</a>
				</div>
			</div>
			<div data-tauri-drag-region id="titlebar">
				<button id="menu-button" className="titlebar-button" onClick={menu}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#e8eaed"
					>
						<path d="M400-160q-33 0-56.5-23.5T320-240q0-33 23.5-56.5T400-320h400q33 0 56.5 23.5T880-240q0 33-23.5 56.5T800-160H400Zm0-240q-33 0-56.5-23.5T320-480q0-33 23.5-56.5T400-560h400q33 0 56.5 23.5T880-480q0 33-23.5 56.5T800-400H400Zm0-240q-33 0-56.5-23.5T320-720q0-33 23.5-56.5T400-800h400q33 0 56.5 23.5T880-720q0 33-23.5 56.5T800-640H400Zm-240 0q-33 0-56.5-23.5T80-720q0-33 23.5-56.5T160-800q33 0 56.5 23.5T240-720q0 33-23.5 56.5T160-640Zm0 240q-33 0-56.5-23.5T80-480q0-33 23.5-56.5T160-560q33 0 56.5 23.5T240-480q0 33-23.5 56.5T160-400Zm0 240q-33 0-56.5-23.5T80-240q0-33 23.5-56.5T160-320q33 0 56.5 23.5T240-240q0 33-23.5 56.5T160-160Z" />
					</svg>
				</button>
				<button id="minimize" className="titlebar-button" onClick={minimize}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
					>
						<path d="M240-120v-80h480v80H240Z" />
					</svg>
				</button>
				<button id="close" className="titlebar-button" onClick={close}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
					>
						<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
					</svg>
				</button>
			</div>
			<div id="page">
				<h1>Gloshjälpare</h1>
				<div className="divider" style={{ marginBottom: '26.8px' }}></div>
			</div>
			<div id="background" />
			<svg width={0} height={0} xmlns="http://www.w3.org/2000/svg">
				<filter id="background-effect" x={0} y={0}>
					<feTurbulence
						baseFrequency={0.0005}
						result="turbulence1"
						seed={49152458}
					/>
					<feGaussianBlur in="turbulence1" stdDeviation={600} />
				</filter>
			</svg>
		</main>
	);
}

export default Glosor;
