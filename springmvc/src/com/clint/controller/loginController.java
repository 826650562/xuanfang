package com.clint.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.clint.service.HomeService;

 

@Controller
@RequestMapping(value = "/chooselogin")
public class loginController {

	@Resource
	private HomeService homeService;
    private static final String SESSION_KEY_OF_RAND_CODE = "randCode"; // todo 要统一常量
	//private JdbcTemplate jdbcTemplate;
	//返回登陆首页
	@RequestMapping(value = "/index")
	public String page() {
		 return "pages/chooseLogin";
	}
	
	@RequestMapping(value = "/loginout")
	public String loginout(HttpServletRequest req) {
		HttpSession session = req.getSession();
		session.setAttribute("_user_manage","");
		return "pages/chooseLogin";
	}
	
	
	//登陆验证
	@RequestMapping(value = "/orderLogin")
	public void orderLogin(HttpServletRequest req,HttpServletResponse reponse,Model model) throws IOException {
		 String username=req.getParameter("_usr");
		 String psw=req.getParameter("_psw");
		 String codeinfo=req.getParameter("_codeinfo");
		 /*String loginsql = "select * from T_WORKORDER_ADMIN t where t.LOGINNAME = '"+username+"' and t.PASSWORD = '"+psw+"'";*/
		
		 
		String code= (String) req.getSession().getAttribute(SESSION_KEY_OF_RAND_CODE);
		 if(codeinfo.toLowerCase().equals(code.toLowerCase())){
			 List loginBack =  homeService.confirmInfo(username, psw);
			 try {
				  if(loginBack.size()>0 ){
					  PrintWriter  pw =	reponse.getWriter();
					  pw.write("登陆成功");
					  HttpSession session = req.getSession();
					  session.setAttribute("_user_manage",username);
				  }else{
					  PrintWriter  pw =	reponse.getWriter();
					  pw.write("登陆失败"); 
				  }
				} catch (IOException e1) {
					e1.printStackTrace();
				}
		 }else{
			 PrintWriter  pw =	reponse.getWriter();
			 pw.write("验证码错误");
		 }
	}
	
 
}
 