import React, { useEffect, useState } from 'react'

import Alert from './components/Alert'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
    const [ persons, setPersons ] = useState([
        {name: 'Sebastian', number: '123-456-789', id: '1'}
    ])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')
    const [ notification, setNotification ] = useState(null)

    const getAllHook = () => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
            .catch(error =>
                console.error(error)
            )
    }

    useEffect(getAllHook, [])

    const addPerson = (event) => {
        event.preventDefault();
    
        if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
          alert(`${newName} is already added to the phonebook`);
          setNewName('');
          setNewNumber('');
          return;
        }
    
        const newPerson = { name: newName, number: newNumber, id: persons.length + 1 };
        setPersons([...persons, newPerson]);
    
        setNotification({
            text: `${newPerson.name} added to the phonebook.`,
            type: 'notification'
        });
    
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    
        setNewName('');
        setNewNumber('');
    };
    

    const deletePerson = (id) => {
        const person = persons.find(p => p.id === id)
        const confirmDelete = window.confirm(`Are you sure you want to delete ${person.name}?`)

        if (confirmDelete) {
            personService
                .remove(id)
                .then(returnedPerson => {
                    persons.map(person => person.id !== id ? person : returnedPerson)
                })
            setPersons(persons.filter(person => person.id !== id))
            setNotification({
                text: `${person.name} was deleted from the phonebook.`,
                type: 'notification'
            })
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilter = (event) => {
        setFilter(event.target.value)
    }

    const personsAfterFilter =
        filter === ''  ? persons : persons.filter(person =>
            person.name.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification notification={notification} />
            <Filter
                filter={filter}
                handleFilter={handleFilter}
            />
            <h3>Add a new</h3>
            <PersonForm
                addPerson={addPerson}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h3>Numbers</h3>
            <Persons
                persons={personsAfterFilter}
                deletePerson={deletePerson}
            />
        </div>
    )
}

export default App