const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the database
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the database
    if (!username || !room) {
        return { 
        error: 'Username and room are required !'
        }
    }

    // Check for existing User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return { 
            error: 'Username is in use !'
        }
    }

    // Store user 
    const user = { id, username, room }
    users.push(user)
    return { user  }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) { // splice is for removing an item from an array list by the index
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id ===id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


// addUser({
//     id: 22,
//     username: 'Aphomer',
//     room: 'Lagos'
// })


// addUser({
//     id: 32,
//     username: 'Mercy',
//     room: 'Osun'
// })


// addUser({
//     id: 42,
//     username: 'Sunday',
//     room: 'Lagos'
// })

// const user = getUser(412)
// console.log(user)

// const userList = getUsersInRoom('Osun')
// console.log(userList)



