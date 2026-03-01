import FeedbackApp from "./FeedBackApp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SkinWise from "./SkinWise";import PassportAnalyzer from "./PassportAnalyzer";
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<SkinWise/>}>
        </Route>
          <Route path="/classifier" element={<FeedbackApp/>}>
        </Route>
          <Route path="/analyzer" element={<PassportAnalyzer/>}>
        </Route>
      </Routes>
       
      </BrowserRouter>
    </>
  );
}

export default App;
