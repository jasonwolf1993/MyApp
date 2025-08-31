import React from 'react';
import { Header } from './component/Header';
import { Content } from './component/Content';
import Tree from './component/Tree';
import MainContent from './component/MainContent';
import { Provider } from 'react-redux';
import { store } from './store';
import { DataView } from './example/component/DataView';

import './App.css'

// function App() {
//   return (
//     <Provider store={store}>
//       <div className="App">
//         <Header></Header>
//         <Content>
//             <Tree></Tree>
//             <MainContent></MainContent>
//         </Content>
        
//       </div>
//     </Provider>
//   );
// }
function App() {
  return (
    <DataView></DataView>
  )
}

export default App;
