package com.clint.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import com.clint.service.MapService;

import net.sf.json.JSONArray;
 

@Controller
@RequestMapping(value = "/home")
public class loginController {

	@Resource(name = "mapService")
	private MapService mapService;
	
	private String ls_conditions;
	
	
	@RequestMapping(value = "/index")
	public String savePerson() {
		System.out.println("savePerson()...");
//		String addSql="";
//	    // String ls_conditions=req.getParameter("ls_conditions");*/
//		addSql="select t.id from T_test t";
//	    List addrList=this.mapService.getListBySql(addSql);
		return "index";//pages/
	}
 

	@RequestMapping(value = "/PeopleByList")
	public void querylistOfpeople(HttpServletRequest req,HttpServletResponse reponse) {
		   //查询人员
		   String addSql="";
		    // String ls_conditions=req.getParameter("ls_conditions");*/
		    if(StringUtils.hasText(ls_conditions)){
		        addSql="select * from T_RYXX t where "+ls_conditions;
		    }else{
		    	 addSql="select * from T_RYXX t ";
		    }
		    List addrList=this.mapService.getListBySql(addSql);
		    JSONArray json=JSONArray.fromObject(addrList);
		     try {
			  PrintWriter  pw=	reponse.getWriter();
			  pw.write(String.valueOf(json));
			} catch (IOException e1) {
				e1.printStackTrace();
			}
	}
 
}
 