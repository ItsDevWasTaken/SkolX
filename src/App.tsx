import { invoke } from '@tauri-apps/api/tauri';
import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import './App.css';
import { resolveResource } from '@tauri-apps/api/path';
import { useEffect } from 'react';

async function desktopinstall() {
	changeCurrentTask('Installerar...', true);

	let rainmeter_zip_path = (
		await resolveResource('assets/rainmeter.zip')
	).slice(4);

	invoke('desktopinstall', { rainmeterZipPath: rainmeter_zip_path }).then(
		(output) => {
			changeCurrentTask(output as string, false);
			setTimeout(() => {
				changeCurrentTask('Ingen nuvarande uppgift', false);
			}, 10000);
		}
	);
}

function changeCurrentTask(task: string, activateLoading: boolean) {
	let current_task = document.getElementById('current-task');
	let loading_icon = document.getElementById('loading-icon');

	if (current_task && loading_icon) {
		if (activateLoading == true) {
			loading_icon.style.display = 'initial';
		} else {
			loading_icon.style.display = 'none';
		}
		current_task.textContent = task;
	}
}

function minimize() {
	appWindow.minimize();
}

function close() {
	appWindow.close();
}

document.addEventListener('contextmenu', function (e) {
	e.preventDefault();
});

async function nompxinstall() {
	let zipPath = (await resolveResource('assets/nompx.zip')).slice(4);

	changeCurrentTask('Installerar...', true);

	invoke('nompxinstall', { zipPath: zipPath as string }).then(function () {
		changeCurrentTask('Ingen nuvarande uppgift', false);
	});
}

function pyinstall() {
	changeCurrentTask('Installerar...', true);
	invoke('pyinstall').then(function () {
		changeCurrentTask('Ingen nuvarande uppgift', false);
	});
}

async function pAIinstall() {
	const zip_path = (await resolveResource('assets/plAIground.zip')).slice(4);

	const load_path = (await resolveResource('assets/load_path.ps1')).slice(4);

	changeCurrentTask('Installerar...', true);

	invoke('pai_install', { zipPath: zip_path, loadPath: load_path }).then(
		function () {
			changeCurrentTask('Ingen nuvarande uppgift', false);
		}
	);
}

async function chromeInstall() {
	changeCurrentTask('Installerar...', true);
	invoke('chrome_install').then(function (output) {
		changeCurrentTask(output as string, false);
	});
}

async function aboutOpen() {
	let about_popup = new WebviewWindow('about', {
		url: 'about.html',
		decorations: false,
		resizable: false,
		height: 400,
		width: 600,
		title: 'Om',
		center: true,
	});

	about_popup.once('tauri://created', function () {
		console.log('Successfully created the about popup window');
	});

	about_popup.once('tauri://error', function (e) {
		console.log(e);
	});
}

function App() {
	let noiseSeed;

	useEffect(() => {
		noiseSeed = localStorage.getItem('noise_seed');

		if (!noiseSeed) {
			localStorage.setItem(
				'noise_seed',
				Math.floor(Math.random() * 999999).toString()
			);
		}
	});

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
			<ul className="settinglist">
				<div id="logo-container" onClick={aboutOpen}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="200"
						height="100"
						viewBox="0 0 282 120"
						fill="none"
						id="logo"
					>
						<g clip-path="url(#clip0_1_5)">
							<mask
								id="path-1-outside-1_1_5"
								maskUnits="userSpaceOnUse"
								x="203"
								y="17"
								width="79"
								height="82"
								fill="black"
							>
								<rect fill="white" x="203" y="17" width="79" height="82" />
								<path d="M229.426 23.1818L242.176 45.2386H242.722L255.608 23.1818H274.494L253.426 58.0909L275.176 93H255.812L242.722 70.7045H242.176L229.085 93H209.858L231.506 58.0909L210.403 23.1818H229.426Z" />
							</mask>
							<path
								d="M229.426 23.1818L234.621 20.1791C233.548 18.3242 231.569 17.1818 229.426 17.1818V23.1818ZM242.176 45.2386L236.982 48.2414C238.054 50.0962 240.034 51.2386 242.176 51.2386V45.2386ZM242.722 45.2386V51.2386C244.854 51.2386 246.826 50.1067 247.902 48.2653L242.722 45.2386ZM255.608 23.1818V17.1818C253.475 17.1818 251.503 18.3138 250.427 20.1551L255.608 23.1818ZM274.494 23.1818L279.631 26.2821C280.75 24.429 280.783 22.1172 279.719 20.2324C278.655 18.3475 276.659 17.1818 274.494 17.1818V23.1818ZM253.426 58.0909L248.289 54.9907C247.123 56.9235 247.14 59.3476 248.334 61.2637L253.426 58.0909ZM275.176 93V99C277.356 99 279.364 97.818 280.422 95.9123C281.48 94.0066 281.421 91.6771 280.269 89.8272L275.176 93ZM255.812 93L250.638 96.038C251.716 97.8729 253.685 99 255.812 99V93ZM242.722 70.7045L247.896 67.6666C246.818 65.8316 244.849 64.7045 242.722 64.7045V70.7045ZM242.176 70.7045V64.7045C240.048 64.7045 238.08 65.8316 237.002 67.6666L242.176 70.7045ZM229.085 93V99C231.213 99 233.182 97.8729 234.259 96.038L229.085 93ZM209.858 93L204.759 89.8379C203.611 91.6884 203.556 94.0153 204.615 95.9178C205.674 97.8204 207.681 99 209.858 99V93ZM231.506 58.0909L236.605 61.253C237.793 59.3369 237.807 56.9165 236.64 54.987L231.506 58.0909ZM210.403 23.1818V17.1818C208.238 17.1818 206.241 18.3483 205.177 20.2342C204.114 22.1201 204.149 24.4328 205.269 26.2857L210.403 23.1818ZM224.232 26.1846L236.982 48.2414L247.371 42.2359L234.621 20.1791L224.232 26.1846ZM242.176 51.2386H242.722V39.2386H242.176V51.2386ZM247.902 48.2653L260.789 26.2085L250.427 20.1551L237.541 42.2119L247.902 48.2653ZM255.608 29.1818H274.494V17.1818H255.608V29.1818ZM269.357 20.0816L248.289 54.9907L258.563 61.1912L279.631 26.2821L269.357 20.0816ZM248.334 61.2637L270.084 96.1728L280.269 89.8272L258.519 54.9181L248.334 61.2637ZM275.176 87H255.812V99H275.176V87ZM260.987 89.962L247.896 67.6666L237.548 73.7425L250.638 96.038L260.987 89.962ZM242.722 64.7045H242.176V76.7045H242.722V64.7045ZM237.002 67.6666L223.911 89.962L234.259 96.038L247.35 73.7425L237.002 67.6666ZM229.085 87H209.858V99H229.085V87ZM214.957 96.1621L236.605 61.253L226.407 54.9288L204.759 89.8379L214.957 96.1621ZM236.64 54.987L215.538 20.0779L205.269 26.2857L226.371 61.1948L236.64 54.987ZM210.403 29.1818H229.426V17.1818H210.403V29.1818Z"
								fill="white"
								mask="url(#path-1-outside-1_1_5)"
							/>
							<path
								d="M43.0227 44.1136C42.7955 41.6136 41.7841 39.6705 39.9886 38.2841C38.2159 36.875 35.6818 36.1705 32.3864 36.1705C30.2045 36.1705 28.3864 36.4545 26.9318 37.0227C25.4773 37.5909 24.3864 38.375 23.6591 39.375C22.9318 40.3523 22.5568 41.4773 22.5341 42.75C22.4886 43.7955 22.6932 44.7159 23.1477 45.5114C23.625 46.3068 24.3068 47.0114 25.1932 47.625C26.1023 48.2159 27.1932 48.7386 28.4659 49.1932C29.7386 49.6477 31.1705 50.0455 32.7614 50.3864L38.7614 51.75C42.2159 52.5 45.2614 53.5 47.8977 54.75C50.5568 56 52.7841 57.4886 54.5795 59.2159C56.3977 60.9432 57.7727 62.9318 58.7045 65.1818C59.6364 67.4318 60.1136 69.9545 60.1364 72.75C60.1136 77.1591 59 80.9432 56.7955 84.1023C54.5909 87.2614 51.4205 89.6818 47.2841 91.3636C43.1705 93.0455 38.2045 93.8864 32.3864 93.8864C26.5455 93.8864 21.4545 93.0114 17.1136 91.2614C12.7727 89.5114 9.39773 86.8523 6.98864 83.2841C4.57955 79.7159 3.34091 75.2045 3.27273 69.75H19.4318C19.5682 72 20.1705 73.875 21.2386 75.375C22.3068 76.875 23.7727 78.0114 25.6364 78.7841C27.5227 79.5568 29.7045 79.9432 32.1818 79.9432C34.4545 79.9432 36.3864 79.6364 37.9773 79.0227C39.5909 78.4091 40.8295 77.5568 41.6932 76.4659C42.5568 75.375 43 74.125 43.0227 72.7159C43 71.3977 42.5909 70.2727 41.7955 69.3409C41 68.3864 39.7727 67.5682 38.1136 66.8864C36.4773 66.1818 34.3864 65.5341 31.8409 64.9432L24.5455 63.2386C18.5 61.8523 13.7386 59.6136 10.2614 56.5227C6.78409 53.4091 5.05682 49.2045 5.07955 43.9091C5.05682 39.5909 6.21591 35.8068 8.55682 32.5568C10.8977 29.3068 14.1364 26.7727 18.2727 24.9545C22.4091 23.1364 27.125 22.2273 32.4205 22.2273C37.8295 22.2273 42.5227 23.1477 46.5 24.9886C50.5 26.8068 53.6023 29.3636 55.8068 32.6591C58.0114 35.9545 59.1364 39.7727 59.1818 44.1136H43.0227ZM83.6932 79.2614L83.7614 59.3864H86.0795L100.807 40.6364H119.693L97.8068 67.5H93.4091L83.6932 79.2614ZM68.6591 93V23.1818H85.3295V93H68.6591ZM101.182 93L87.4773 71.25L98.4545 59.4205L120.443 93H101.182ZM147.946 93.9886C142.446 93.9886 137.719 92.8636 133.764 90.6136C129.832 88.3409 126.798 85.1818 124.662 81.1364C122.548 77.0682 121.491 72.3523 121.491 66.9886C121.491 61.6023 122.548 56.8864 124.662 52.8409C126.798 48.7727 129.832 45.6136 133.764 43.3636C137.719 41.0909 142.446 39.9545 147.946 39.9545C153.446 39.9545 158.162 41.0909 162.094 43.3636C166.048 45.6136 169.082 48.7727 171.196 52.8409C173.332 56.8864 174.401 61.6023 174.401 66.9886C174.401 72.3523 173.332 77.0682 171.196 81.1364C169.082 85.1818 166.048 88.3409 162.094 90.6136C158.162 92.8636 153.446 93.9886 147.946 93.9886ZM148.048 81.4091C150.048 81.4091 151.741 80.7955 153.128 79.5682C154.514 78.3409 155.571 76.6364 156.298 74.4545C157.048 72.2727 157.423 69.75 157.423 66.8864C157.423 63.9773 157.048 61.4318 156.298 59.25C155.571 57.0682 154.514 55.3636 153.128 54.1364C151.741 52.9091 150.048 52.2955 148.048 52.2955C145.98 52.2955 144.23 52.9091 142.798 54.1364C141.389 55.3636 140.31 57.0682 139.56 59.25C138.832 61.4318 138.469 63.9773 138.469 66.8864C138.469 69.75 138.832 72.2727 139.56 74.4545C140.31 76.6364 141.389 78.3409 142.798 79.5682C144.23 80.7955 145.98 81.4091 148.048 81.4091ZM199.611 23.1818V93H182.94V23.1818H199.611Z"
								fill="white"
							/>
						</g>
						<defs>
							<clipPath id="clip0_1_5">
								<rect width="282" height="120" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</div>
				<div className="listitem">
					<h4 className="listlabel">
						Installera Lively Wallpaper, TranslucentTB och Rainmeter
					</h4>
					<button onClick={desktopinstall} className="installbutton">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="100%"
							height="100%"
							viewBox="0 0 24 24"
							version="1.1"
							xmlSpace="preserve"
							style={{
								fillRule: 'evenodd',
								clipRule: 'evenodd',
								strokeLinejoin: 'round',
								strokeMiterlimit: '2',
							}}
						>
							<path
								d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
								style={{ fill: 'white', fillRule: 'nonzero' }}
							/>
						</svg>
						<path
							xmlns="http://www.w3.org/2000/svg"
							d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
							style={{ fill: '#fff', fillRule: 'nonzero' }}
						/>
					</button>
				</div>
				<div className="listitem">
					<h4 className="listlabel">Ladda ner NompX</h4>
					<button onClick={nompxinstall} className="installbutton">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="100%"
							height="100%"
							viewBox="0 0 24 24"
							version="1.1"
							xmlSpace="preserve"
							style={{
								fillRule: 'evenodd',
								clipRule: 'evenodd',
								strokeLinejoin: 'round',
								strokeMiterlimit: '2',
							}}
						>
							<path
								d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
								style={{ fill: 'white', fillRule: 'nonzero' }}
							/>
						</svg>
						<path
							xmlns="http://www.w3.org/2000/svg"
							d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
							style={{ fill: '#fff', fillRule: 'nonzero' }}
						/>
					</button>
				</div>
				<div className="listitem">
					<h4 className="listlabel">Installera Python</h4>
					<button onClick={pyinstall} className="installbutton">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="100%"
							height="100%"
							viewBox="0 0 24 24"
							version="1.1"
							xmlSpace="preserve"
							style={{
								fillRule: 'evenodd',
								clipRule: 'evenodd',
								strokeLinejoin: 'round',
								strokeMiterlimit: '2',
							}}
						>
							<path
								d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
								style={{ fill: 'white', fillRule: 'nonzero' }}
							/>
						</svg>
						<path
							xmlns="http://www.w3.org/2000/svg"
							d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
							style={{ fill: '#fff', fillRule: 'nonzero' }}
						/>
					</button>
				</div>
				<div className="listitem">
					<h4 className="listlabel">Installera plAIground</h4>
					<button onClick={pAIinstall} className="installbutton">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="100%"
							height="100%"
							viewBox="0 0 24 24"
							version="1.1"
							xmlSpace="preserve"
							style={{
								fillRule: 'evenodd',
								clipRule: 'evenodd',
								strokeLinejoin: 'round',
								strokeMiterlimit: '2',
							}}
						>
							<path
								d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
								style={{ fill: 'white', fillRule: 'nonzero' }}
							/>
						</svg>
						<path
							xmlns="http://www.w3.org/2000/svg"
							d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
							style={{ fill: '#fff', fillRule: 'nonzero' }}
						/>
					</button>
				</div>
				<div className="listitem">
					<h4 className="listlabel">Installera Chrome</h4>
					<button onClick={chromeInstall} className="installbutton">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="100%"
							height="100%"
							viewBox="0 0 24 24"
							version="1.1"
							xmlSpace="preserve"
							style={{
								fillRule: 'evenodd',
								clipRule: 'evenodd',
								strokeLinejoin: 'round',
								strokeMiterlimit: '2',
							}}
						>
							<path
								d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
								style={{ fill: 'white', fillRule: 'nonzero' }}
							/>
						</svg>
						<path
							xmlns="http://www.w3.org/2000/svg"
							d="M12,16l-5,-5l1.4,-1.45l2.6,2.6l0,-8.15l2,0l0,8.15l2.6,-2.6l1.4,1.45l-5,5Zm-6,4c-0.55,0 -1.021,-0.196 -1.412,-0.587c-0.392,-0.392 -0.588,-0.863 -0.588,-1.413l0,-3l2,0l0,3l12,0l0,-3l2,0l0,3c0,0.55 -0.196,1.021 -0.587,1.413c-0.392,0.391 -0.863,0.587 -1.413,0.587l-12,0Z"
							style={{ fill: '#fff', fillRule: 'nonzero' }}
						/>
					</button>
				</div>
			</ul>
			<div id="progress-bar">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					id="loading-icon"
				>
					<path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
				</svg>
				<div id="current-task">
					<div>Ingen nuvarande upgift</div>
				</div>
			</div>
			<div id="background" />
			<svg width={0} height={0} xmlns="http://www.w3.org/2000/svg">
				<filter id="background-effect" x={0} y={0}>
					<feTurbulence
						baseFrequency={0.0005}
						result="turbulence1"
						seed={noiseSeed}
					/>
					<feGaussianBlur in="turbulence1" stdDeviation={350} />
				</filter>
			</svg>
		</main>
	);
}

export default App;
