import * as Router from 'react-router-dom';
import Home from './Home';
import Glosor from './Glosor';

function App() {
	return (
		<Router.Routes>
			<Router.Route path="/" element={<Home />} />
			<Router.Route path="glosor" element={<Glosor />} />
		</Router.Routes>
	);
}

export default App;
