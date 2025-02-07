//cohort
const COHORT = "2411-FTB-ET-WEB-PT";

//API URL
const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events";

const fetchAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    state.events = json.data;

    renderAllEvents();
  } catch (error) {
    console.log("Error in fetchAllEvents", error);
  }
};

const createNewEvent = async (name, imageUrl, description, date) => {
  try{
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        imageUrl,
        description
      })
    })
  }
  catch (error) {

  }
}

const removeEvent = async (id) =>{
  try {
    await fetch(`${API_URL}/${id}`)
  }
  catch {

  }
}

