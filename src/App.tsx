import styles from './App.module.css';
import { DragContainer } from './components/DragContainer';
import { resetLayout } from './store';
import { Layout } from './types';
import { useEffect, useState } from 'react';
import { getAsyncConfig } from './utils/getAsyncConfig';

const App = () => {
	const [config, setConfig] = useState<Layout | undefined>();

	useEffect(() => {
		(async function () {
			const layout = await getAsyncConfig();
			setConfig(layout);
		})();
	}, []);

	const update = (layout: Layout) => localStorage.setItem('layout', JSON.stringify(layout));

	return (
		<div>
			<button onClick={resetLayout}>Reset</button>
			<DragContainer className={styles.grid} config={config} updateConfig={update}>
				<div className={`${styles.item} ${styles.tall}`}>1</div>
				<div className={styles.item}>2</div>
				<div className={styles.item}>3</div>
				<div className={styles.item}>4</div>
				<div className={styles.item}>5</div>
				<div className={styles.item}>6</div>
				<div className={`${styles.item} ${styles.wide}`}>7</div>
				<div className={styles.item}>8</div>
				<div className={styles.item}>9</div>
				<div className={styles.item}>10</div>
				<div className={styles.item}>11</div>
				<div className={styles.item}>12</div>
				<div className={styles.item}>13</div>
			</DragContainer>
		</div>
	);
};

export default App;
