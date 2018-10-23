package com.clint.controller;

import java.io.IOException;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.cookie.Cookie;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.clint.model.HttpClientUtil;
import com.clint.service.MapService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/login")
public class tenementController {

	@Resource(name = "mapService")
	private MapService mapService;

	// 用户名
	private static String Uid = "luos890719";

	// 接口安全秘钥
	private static String Key = "d41d8cd98f00b204e980";
	
	@RequestMapping(value = "/index")
	public String savePerson(HttpServletRequest req) {
		String getpublicRentalRecord = String.valueOf(req.getSession().getAttribute("publicRentalRecord"));
		String getLimitAreaString = String.valueOf(req.getSession().getAttribute("limitArea"));
		if(!getpublicRentalRecord.equals("null")){
			req.getSession().setAttribute("publicRentalRecord",null);//存储用户公租备案号
			
		}else if(!getLimitAreaString.equals("null")){
			req.getSession().setAttribute("limitArea",null);//存储用户选房面积限制
		}		
		return "pages/login";
	}

	/* 用户验证 */
	@RequestMapping(value = "/tenement", method = RequestMethod.POST)
	public void tenement(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		//获取传入的参数
		String tenementname = req.getParameter("tenement");//承租人名
		String public_rental_record = req.getParameter("public_rental_record");//公租备案号
		String verifyCode = req.getParameter("verifyCode");
		String checkCookie = req.getParameter("cookie");
		
		String addSql = "";
		if (StringUtils.hasText(tenementname) && StringUtils.hasText(public_rental_record)) {
			addSql = "select t.limitarea from t_bim_chooseroom_tenement t where t.phonenum='" + tenementname
					+ "' and t.public_rental_record='" + public_rental_record + "'";
		} 
		List list = this.mapService.getListBySql(addSql);
		JSONArray jsonArray = JSONArray.fromObject(list);
		String submitVerify;
		JSONObject rtns = new JSONObject();
		
		if(checkCookie.endsWith("true")){
			if (jsonArray.size() > 0) {
				JSONObject obj = (JSONObject) jsonArray.get(0);
				String area = obj.getString("LIMITAREA");
				submitVerify = "用户验证成功！";
				req.getSession().setMaxInactiveInterval(15*60);
				req.getSession().setAttribute("verifyCode",null);
				req.getSession().setAttribute("publicRentalRecord",public_rental_record);//存储用户公租备案号
				req.getSession().setAttribute("limitArea",area);//存储用户选房面积限制
				req.getSession().setAttribute("_user_app",tenementname);//存储用户选房面积限制
				rtns.put("success", submitVerify);
			} else {
				submitVerify = "用户验证失败！";
				rtns.put("error", submitVerify);
			}
			
		}else if(checkCookie.endsWith("false")){
			//读取验证码
			String getVerifyCode = String.valueOf(req.getSession().getAttribute("verifyCode")) ; 
			if(getVerifyCode.equals("null")){
				rtns.put("verifyCodeOverdue", "验证码过期，请重新获取！");
			}else if(!getVerifyCode.equals(verifyCode)){
				rtns.put("verifyCodeError", "验证码错误，请重新输入！");
			}else if(getVerifyCode.equals(verifyCode)){
				if (jsonArray.size() > 0) {
					JSONObject obj = (JSONObject) jsonArray.get(0);
					String area = obj.getString("LIMITAREA");
					submitVerify = "用户验证成功！";
					req.getSession().setMaxInactiveInterval(15*60);
					req.getSession().setAttribute("verifyCode",null);
					req.getSession().setAttribute("publicRentalRecord",public_rental_record);//存储用户公租备案号
					req.getSession().setAttribute("limitArea",area);//存储用户选房面积限制
					req.getSession().setAttribute("_user_app",tenementname);//存储用户选房面积限制
					rtns.put("success", submitVerify);
				} else {
					submitVerify = "用户验证失败！";
					rtns.put("error", submitVerify);
				}
			}	
		}
			
		try {
			reponse.getWriter().write(rtns.toString());
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	/**
	 * 生成验证码     session.setMaxInactiveInterval(5*60);/
	 * */
	@RequestMapping(value = "/sendVerifyCode")
	public void sendVerifyCode(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		req.getSession().setMaxInactiveInterval(5*60);
        HttpClientUtil client = HttpClientUtil.getInstance();
        String smsMob = req.getParameter("mobile"); //手机号
        String verifyCode = String.valueOf(new Random().nextInt(8999) + 1000);
        String smsText = "您的验证码为"+ verifyCode +"，在5分钟内有效。如非本人操作请忽略本短信";
        req.getSession().setAttribute("verifyCode", verifyCode);
		//UTF发送
		int result = client.sendMsgUtf8(Uid, Key, smsText, smsMob);
		JSONObject obj = new JSONObject();
		if(result>0){
			obj.put("success", "验证码发送成功!");			
		}else{
			obj.put("error", "验证码发送失败!");
		}
		reponse.getWriter().write(String.valueOf(obj));
	}

}
