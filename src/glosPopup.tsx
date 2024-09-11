import './glosPopup.css';
import { appWindow } from '@tauri-apps/api/window';
import { emit } from '@tauri-apps/api/event';

document.addEventListener('DOMContentLoaded', () => {
	emit('glosPopup_apply_shadow');
});

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});

const onCountEntered = () => {
	const count_input = document.getElementById(
		'count-input'
	) as HTMLInputElement;

	let value = eval(count_input.value);

	if (value > 99) {
		count_input.value = '99';
		value = 99;
	}

	if (value < 1) {
		count_input.value = '1';
		value = 1;
	}

	if (value != null) {
		let glos_input_elements = document.querySelectorAll('input.glos-input');
		let svar_input_elements = document.querySelectorAll('input.svar-input');

		for (let i = 0; i < glos_input_elements.length; i++) {
			glos_input_elements[i].remove();
			svar_input_elements[i].remove();
		}

		const glos_input = document.createElement('input');
		const svar_input = document.createElement('input');

		glos_input.type = 'text';
		svar_input.type = 'text';

		glos_input.className = 'glos-input';
		svar_input.className = 'svar-input';

		const glos_inputs = document.getElementById('glos-inputs');
		const svar_inputs = document.getElementById('svar-inputs');

		for (let i = 0; i < value; i++) {
			glos_inputs?.appendChild(glos_input.cloneNode(false));
			svar_inputs?.appendChild(svar_input.cloneNode(false));
		}

		glos_input_elements = document.querySelectorAll('input.glos-input');
		svar_input_elements = document.querySelectorAll('input.svar-input');

		(glos_input_elements[0] as HTMLInputElement).placeholder =
			'Skriv glosorna här';
		(svar_input_elements[0] as HTMLInputElement).placeholder =
			'Skriv svaren här';
	}
};

function minimize() {
	appWindow.minimize();
}

function close() {
	const page = document.getElementById('page');

	if (page) {
		page.style.filter = 'none';
	}

	let glosInputList: Array<string> = [];
	let svarInputList: Array<string> = [];

	const glosInputs = document.querySelectorAll('input.glos-input');
	glosInputs.forEach((element) => {
		if ((element as HTMLInputElement).value != '') {
			glosInputList.push((element as HTMLInputElement).value);
		}
	});

	const svarInputs = document.querySelectorAll('input.svar-input');
	svarInputs.forEach((element) => {
		if ((element as HTMLInputElement).value != '') {
			svarInputList.push((element as HTMLInputElement).value);
		}
	});

	if (svarInputList.length > 0 && glosInputList.length > 0) {
		svarInputList.forEach((svaret) => {
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

			newGlosa.textContent = glosInputList[svarInputList.indexOf(svaret)];

			page?.appendChild(newGlosaOchSvar);

			newGlosaOchSvar.appendChild(newGlosa);
			newGlosaOchSvar?.appendChild(newSvarInput);
		});
	}

	appWindow.close();

	emit('saved_glosor', { glosor: glosInputList, svar: svarInputList });
}

function GlosPopup() {
	return (
		<main>
			<div data-tauri-drag-region id="titlebar">
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
			<div id="count-container">
				<h2>Hur många glosor?</h2>
				<input type="number" id="count-input" onInput={onCountEntered} />
			</div>
			<div id="inputs">
				<div id="glos-inputs">
					<input
						type="text"
						className="glos-input"
						placeholder="Skriv glosorna här"
					/>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="40px"
					viewBox="0 -960 960 960"
					width="40px"
					fill="#e8eaed"
					id="arrow-icon"
				>
					<path d="M616.61-427H193.78q-22.08 0-37.54-15.46-15.46-15.45-15.46-37.54t15.46-37.54Q171.7-533 193.78-533h422.83l-93.09-93.09q-15.39-15.39-15.17-37.04.21-21.65 15.17-37.04 15.39-15.4 37.26-15.61 21.87-.22 37.26 15.17l183.57 183q7.69 7.7 11.61 17.52 3.91 9.83 3.91 20.09t-3.91 20.09q-3.92 9.82-11.61 17.52l-183.57 183q-15.39 15.39-37.26 15.17-21.87-.21-37.26-15.61-14.96-15.39-15.17-37.04-.22-21.65 15.17-37.04L616.61-427Z" />
				</svg>
				<div id="svar-inputs">
					<input
						type="text"
						className="svar-input"
						placeholder="Skriv svaren här"
					/>
				</div>
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

export default GlosPopup;
