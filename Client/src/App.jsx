import { useState } from "react";
import Upload from "./components/Upload";
import Statistics from "./components/Statistics";

function App() {
  //usestate for conditional rendering when the stats is okey and if failed do something else
  const [dataAvail, setDataAvail] = useState(false);
  const [data, setData] = useState([""]);
  //kirim file csv ke belakang
  const handelFile = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result && Object.keys(result).length > 0) {
          setDataAvail(true);
          setData(result);
        } else {
          alert(
            "failed to processing file please make sure your file within 5MB and csv format",
          );
        }
      } else {
        alert(
          "failed to processing file please make sure your file within 5MB and csv format",
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      {dataAvail ? (
        <Statistics
          goBackToUpload={() => setDataAvail(false)}
          parsingData={data}
        />
      ) : (
        <Upload handleUpload={handelFile} />
      )}
    </>
  );
}

export default App;
