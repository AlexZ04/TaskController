export async function fetchNotes()
{
    try {
        var response = await axios.get("https://localhost:7178/Tasks");

        return response.data;
    }
    catch (e) {
        console.error(e);
    } 
}

export async function fetchOneNote(id) {
    try {
        var response = await axios.get(`https://localhost:7178/Tasks/${id}`)
        return response.data;
    }
    catch (e) {
        console.error(e);
    } 
}

export async function addNote(note) {
    try {
        var response = await axios.post(`https://localhost:7178/Tasks`, note)
        return response.data;
    }
    catch (e) {
        console.error(e);
    } 
}

export async function checkNote(id) {
    try {
        var response = await axios.patch(`https://localhost:7178/Tasks/${id}`)
        return response.status;
    }
    catch (e) {
        console.error(e);
    } 
}

export async function deleteNote(id) {
    try {
        var response = await axios.delete(`https://localhost:7178/Tasks/${id}`)
        return response.status;
    }
    catch (e) {
        console.error(e);
    } 
}

export async function changeNote(id, newNote) {
    try {
        var response = await axios.put(`https://localhost:7178/Tasks/${id}`, newNote)
        return response.status;
    }
    catch (e) {
        console.error(e);
    } 
}

export async function uploadNotes(notesList) {
    try {
        var response = await axios.post(`https://localhost:7178/Tasks/upload`, notesList)
        return response.status;
    }
    catch (e) {
        console.error(e);
    } 
}

