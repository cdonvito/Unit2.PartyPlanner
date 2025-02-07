//cohort
const COHORT = "2411-FTB-ET-WEB-PT-cmd";

//API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

console.log(API_URL);

const state = {
  events: [],
};

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

const createNewEvent = async (name, description, date, time, location) => {
  try {
    console.log('12hr time: ' + time);
    const dateTime = date + "T" + time;
    console.log('DateTime: ' + dateTime);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        date: new Date(dateTime).toISOString(),
        location,
      }),
    });

    fetchAllEvents();
  } catch (error) {
    console.log("Error in createNewEvent", error);
  }
};

const removeEvent = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "Delete",
    });
  } catch (error) {
    console.log("Error in removeEvent", error);
  }
};

const renderAllEvents = () => {
  const eventsContainer = document.getElementById("events-container");
  const eventsList = state.events;

  if (!eventsList || eventsList.length === 0) {
    eventsContainer.innerHTML = "<h3>No events found</h3>";
    return;
  }

  eventsContainer.innerHTML = "";

  eventsList.forEach((event) => {
    const eventElement = document.createElement("div");
    const rawDate = event.date;
    const dateConv = rawDate.split("T")[0];
    const timeConv = rawDate.split("T")[1].split(".000Z")[0];
    console.log('Date: ' + dateConv);
    console.log('Time: ' + timeConv);
    eventElement.classList.add("event-card");
    eventElement.innerHTML = `
      <h4>${event.name}</h4>
      <p>${event.description}</p>
      <p>${event.location}</p>
      <p>${dateConv}</p>
      <p>${timeConv}</p>
      <button class="delete-button" data-id="${event.id}">Remove</button>
    `;

    eventsContainer.appendChild(eventElement);

    const deleteButton = eventElement.querySelector(".delete-button");

    deleteButton.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeEvent(event.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

const addListenerToForm = () => {
  const form = document.querySelector("#new-event-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewEvent(
      form.name.value,
      form.location.value,
      form.description.textContent,
      form.date.value,
      form.time.value
    );

    form.name.value = "";
    form.location.value = "";
    form.description.textContent = "";
    form.date.value = "";
    form.time.value = "";
  });
};

const init = async () => {
  await fetchAllEvents();
  addListenerToForm();
};

init();
