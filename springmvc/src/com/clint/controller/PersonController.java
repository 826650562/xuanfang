package com.clint.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.clint.model.Person;
import com.clint.service.MapService;
import com.clint.service.PersonService;

@Controller
@RequestMapping(value = "/person")
public class PersonController {

	@Resource(name = "personService")
	private PersonService personService;
	@Resource(name = "mapService")
	private MapService mapService;

	@RequestMapping(value = "/savePersonUI")
	public String savePersonUI() {
		return "savePersonForm";
	}

	@RequestMapping(value = "/save")
	public String savePerson(Person p) {
		personService.savePerson(p);
		System.out.println("savePerson()...");
		return "redirect:/person/findAllPerson";
	}

	@RequestMapping(value = "/findAllPerson")
	public String findAllPerson(HttpServletRequest req) {
		System.out.println("开始");
		List xx =this.mapService.getListBySql("select * from t_user");
	/*	List<Person> persons = personService.findAllPerson();
		req.setAttribute("persons", persons);*/
		return "personList";
	}

	@RequestMapping(value = "/deletePerson")
	public String deletePerson(Person p) {
		personService.deletePerson(p);

		return "redirect:/person/findAllPerson";
	}

	@RequestMapping(value = "/deletePersons")
	public String deletePersons(String ids) {
		ids = ids.substring(0, ids.length() - 1);

		String[] idss = ids.split(",");
		Person p = new Person();

		for (int i = 0; i < idss.length; i++) {
			p.setId(idss[i]);
			personService.deletePerson(p);
		}
		return "redirect:/person/findAllPerson";
	}

	@RequestMapping(value = "/updatePersonUI")
	public String updatePersonUI(String id, HttpServletRequest req) {
		System.out.println("kaishi");
		List xx = mapService.getListBySql("select * from person");
		Person p = personService.findPersonById(id);
		req.setAttribute("p", p);
		return "Upfile";
	}

	@RequestMapping(value = "/updatePerson")
	public String updatePerson(Person p) {
		personService.updatePerson(p);

		return "redirect:/person/findAllPerson";
	}

	@RequestMapping(value = "/upfile")
	public String upload(MultipartFile uploadFile, HttpSession session) throws IOException {
		if (uploadFile.getSize() > 0) {
			String filename = uploadFile.getOriginalFilename();
			if (filename.endsWith("jpg") || filename.endsWith("gif") || filename.endsWith("png")) {
				String leftPath = session.getServletContext().getRealPath("/images");
				File file = new File(leftPath, filename);
				System.out.println(file.getParentFile());
				if (!file.getParentFile().exists()) {
					file.getParentFile().mkdirs();
				}
				uploadFile.transferTo(file);
			}
		} else {
			return "error";
		}
		return "uploadSuccess";
	}
}
