import { emit } from '@tauri-apps/api/event';
import './About.css';
import { appWindow } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';

document.addEventListener('DOMContentLoaded', async function () {
	emit('about_apply_shadow');

	while (true) {
		let version_p = document.getElementById('version');
		let version = await getVersion();
		if (version_p) {
			version_p.textContent = `SkolX-version ${version}`;
			break;
		}
	}
});

document.addEventListener('contextmenu', function (e) {
	e.preventDefault();
});

function closeAbout() {
	appWindow.close();
}

function About() {
	return (
		<main>
			<div data-tauri-drag-region id="titlebar">
				<button id="close" onClick={closeAbout}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="22px"
						viewBox="0 -960 960 960"
						width="22px"
						id="close-icon"
					>
						<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
					</svg>
				</button>
			</div>
			<h1 id="header">Om</h1>
			<ul id="info">
				<p className="about_label" id="version">
					SkolX-version hittades inte
				</p>
			</ul>
			<div id="about-background" />
			<svg width={0} height={0} xmlns="http://www.w3.org/2000/svg">
				<filter id="about-background-effect" x={0} y={0}>
					<feTurbulence
						baseFrequency={0.002}
						result="turbulence1"
						seed={3127368}
					/>
					<feGaussianBlur in="turbulence1" stdDeviation={500} />
				</filter>
			</svg>
		</main>
	);
}

export default About;
