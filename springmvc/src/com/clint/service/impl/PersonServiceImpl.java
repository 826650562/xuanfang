package com.clint.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.clint.dao.PersonDao;
import com.clint.model.Person;
import com.clint.service.PersonService;


@Service(value="personService")
public class PersonServiceImpl implements PersonService {

	@Resource(name="personDao")
	private PersonDao personDao;
	
	public void savePerson(Person p) {
		personDao.savePerson(p);
	}
	public void deletePerson(Person p) {
		personDao.deletePerson(p);
	}
	public List<Person> findAllPerson() {
		return personDao.findAllPerson();
	}
	public Person findPersonById(String id) {
		return personDao.findPersonById(id);
	}
	public void updatePerson(Person p) {
		personDao.updatePerson(p);
	}

}
