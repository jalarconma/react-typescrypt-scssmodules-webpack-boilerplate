import React from "react";
import styles from './App.scss';

const App: React.FC = () => {
  const test = 34;
return (
<div 
className={styles['wrapper']}
>
<h1>React 17 and TypeScript 4 App!🚀 {test}</h1>
</div>
  );
};
export default App;