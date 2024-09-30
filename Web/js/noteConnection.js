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

console.log(await fetchOneNote(8));
