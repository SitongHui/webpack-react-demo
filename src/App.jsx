import React from 'react';
import ReactDom from 'react-dom';

// ES6语法
const App = () => {
    return (
        <div>
            <h1>React大法好</h1>
            <p>这是一个react项目</p>
            <p>test</p>
        </div>
    )
}

export default App;
ReactDom.render(<App/>, document.getElementById('app'));
