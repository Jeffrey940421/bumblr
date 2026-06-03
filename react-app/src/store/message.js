const GET_MESSAGES = "GET /api/messages/current";
const ADD_MESSAGE = "POST /api/messages/new";
const READ_MESSAGE = "PUT /api/messages/users/:id";

function getMessages(messages) {
  return {
    type: GET_MESSAGES,
    messages,
  };
}

export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    message,
  };
}

function readMessage(id) {
  return {
    type: READ_MESSAGE,
    id,
  };
}

export const getMessagesThunk = () => async (dispatch) => {
  const response = await fetch("/api/messages/current");

  if (response.ok) {
    const data = await response.json();
    dispatch(getMessages(data.messages));
  }
}

export const addMessageThunk = (message) => async (dispatch) => {
  const response = await fetch("/api/messages/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addMessage(data.message));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const readMessageThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/messages/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    dispatch(readMessage(id));
  }
}

const initialState = {};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES: {
      const newState = {};
      action.messages.forEach((message) => {
        if (!newState[message.associated_user.id]) {
          newState[message.associated_user.id] = [message];
        } else {
          newState[message.associated_user.id].push(message);
        }
      });
      return newState;
    }
    case ADD_MESSAGE: {
      const newState = { ...state };
      if (!newState[action.message.associated_user.id]) {
        newState[action.message.associated_user.id] = [action.message];
      } else {
        newState[action.message.associated_user.id] = [...newState[action.message.associated_user.id]];
        newState[action.message.associated_user.id].push(action.message);
      }
      return newState;
    }
    case READ_MESSAGE: {
      const newState = { ...state };
      if (newState[action.id]) {
        newState[action.id].forEach((message) => {
          message.read = true;
        });
        return newState;
      }
      return state;
    }
    default:
      return state;
  }
}

export default messagesReducer;
