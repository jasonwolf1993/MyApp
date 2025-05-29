import './App.css';
import { Header } from './Header';
import { Content } from './Content';
import Tree from './Tree';
import MainContent from './MainContent';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Content>
          <Tree></Tree>
          <MainContent></MainContent>
      </Content>
      
    </div>
  );
}

export default App;
