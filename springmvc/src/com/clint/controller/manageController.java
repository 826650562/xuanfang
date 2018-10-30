package com.clint.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import com.clint.model.HttpClientUtil;
import com.clint.service.ManageService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/manage")
public class manageController {

	@Resource(name = "manageService")
	private ManageService manageService;

	@RequestMapping(value = "/index")
	public String index(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		HttpSession session = req.getSession();
		String usr = (String) session.getAttribute("_user_manage");
		model.addAttribute("username", usr);
		return "manage/manageIndex";
	}
	
/*	@RequestMapping(value = "/indextest")
	public String indextest(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		HttpSession session = req.getSession();
		String usr = (String) session.getAttribute("_user_manage");
		model.addAttribute("username", usr);
		return "pages/manageIndex";
	}*/

	// 用户名
	private static String Uid = "luos890719";

	// 接口安全秘钥
	private static String Key = "d41d8cd98f00b204e980";

	// 获取初始数据
	@RequestMapping(value = "/indexMsg")
	public void indexMsg(HttpServletRequest req, HttpServletResponse reponse) {		
		List delList = this.manageService.delList();
		JSONArray delJsonArray = JSONArray.fromObject(delList);
		
		List rentalList = this.manageService.getRentalAll();
		JSONArray rentalJsonArray = JSONArray.fromObject(rentalList);
		
		JSONObject obj = new JSONObject();
		obj.put("rentalJson", rentalJsonArray);
		obj.put("delJsonArray", delJsonArray);
		obj.put("delCount", delList.size());

		try {
			PrintWriter pw = reponse.getWriter();
			pw.write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 获取承租人信息以及承租人所选房屋信息
	@RequestMapping(value = "/getApplyDetail")
	public void chooseRoom(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String id = req.getParameter("id");
		List userInfo = new ArrayList();
		if (StringUtils.hasText(id)) {
			userInfo = this.manageService.getUserInfoById(id);			
		}

		JSONArray jsonArr = JSONArray.fromObject(userInfo);
		JSONObject json = new JSONObject();
		if (jsonArr.size() > 0) {
			JSONObject obj = (JSONObject) jsonArr.get(0);
			String tel = obj.getString("PHONENUM");
			String tel1 = tel.substring(0, 3);
			String tel2 = tel.substring(7);
			obj.put("PHONENUM", tel1 + "****" + tel2);
			String ID = obj.getString("IDCARD");
			String IDCARD1 = ID.substring(0, 6);
			String IDCARD2 = ID.substring(14);
			obj.put("IDCARD", IDCARD1 + "********" + IDCARD2);
			json.put("arr", obj);
		} else {
			json.put("error", "当前选房信息不存在！");
		}

		try {
			PrintWriter pw = reponse.getWriter();
			pw.write(String.valueOf(json));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 修改房屋状态信息
	@RequestMapping(value = "/toSetApply", produces = "application/json;charset=utf-8")
	public void toSetApply(HttpServletRequest req, HttpServletResponse reponse) {
		String id = req.getParameter("id");
		String addSql = "";
		if (StringUtils.hasText(id)) {
			this.manageService.updateRoomStatus(id);
		}
		List searchList = this.manageService.searchRoomById(id);
		JSONArray json = JSONArray.fromObject(searchList);
		JSONObject obj = (JSONObject) json.get(0);
		if (json.size() == 1) {
			obj.put("setSuccess", "受理成功!");
		} else {
			obj.put("setFailed", "受理失败!");
		}
		try {
			PrintWriter pw = reponse.getWriter();
			pw.write(String.valueOf(json));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 获取已处理信息
	@RequestMapping(value = "/treatedApply")
	public void treatedApply(HttpServletRequest req, HttpServletResponse reponse) {
		String rentalSql = "";
		String delSql = "";
		
		List delList = this.manageService.delAllInfo();
		JSONArray delJsonArray = JSONArray.fromObject(delList);
		
		List rentalList = this.manageService.getRentalAll();
		JSONArray rentalJsonArray = JSONArray.fromObject(rentalList);
		JSONObject obj = new JSONObject();
		obj.put("rentalJson", rentalJsonArray);
		obj.put("delJsonArray", delJsonArray);
		obj.put("delCount", delList.size());
		try {
			PrintWriter pw = reponse.getWriter();
			pw.write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 获取所有已处理信息接口 http://localhost:8080/springmvc/manage/getAllTreatedApply
	@RequestMapping(value = "/getAllTreatedApply")
	public void getAllTreatedApply(HttpServletRequest req, HttpServletResponse reponse) {
		String rentalSql = "";
		reponse.setContentType("text/html;charset=utf-8");
		List getAllIdList = this.manageService.getAllDelInfoId();
		JSONArray getAllIdArray = JSONArray.fromObject(getAllIdList);
		JSONArray endListArray = new JSONArray();
		for (int i = 0; i < getAllIdArray.size(); i++) {
			String id = ((JSONObject) getAllIdArray.get(i)).getString("ID");
			List rentalList = this.manageService.getRentalInfoById(id);
			
			JSONArray rentalJsonArray = JSONArray.fromObject(rentalList);
			JSONObject object = (JSONObject) rentalJsonArray.get(0);
			endListArray.add(object);
		}
		try {
			PrintWriter pw = reponse.getWriter();
			pw.write(String.valueOf(endListArray));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
	 

	@RequestMapping(value = "/sendMessage")
	public void sendMessage(HttpServletRequest req, HttpServletResponse reponse) throws IOException {

		HttpClientUtil client = HttpClientUtil.getInstance();
		String smsMob = req.getParameter("mobile"); // 手机号
		String smsName = req.getParameter("name");// 租户名称

		String smsText = smsName + "，您好，您申请的公租房已被审核通过，请于xx月xx日携带有效证件前往中心签合同。";
		// UTF发送
		int result = client.sendMsgUtf8(Uid, Key, smsText, smsMob);
		JSONObject obj = new JSONObject();
		if (result > 0) {
			obj.put("success", "发送成功!");

		} else {
			obj.put("error", "发送失败!");
		}
		reponse.getWriter().write(String.valueOf(obj));
	}

	//房屋看板页面
	@RequestMapping(value = "/showRoomStatus")
	public String showRoomStatus(HttpServletRequest req, HttpServletResponse reponse,Model model){
		List addList = this.manageService.getAllRoom();
		JSONArray jsonArr = JSONArray.fromObject(addList);
		
		model.addAttribute("roomAll",jsonArr);
		return "manage/showRoomStatus";
	}
	
	//获取房屋状态表中出租以及被选房屋数量以及列表
	@RequestMapping(value = "/getAllRoomStatus")
	public void getAllRoomStatus(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		List rentalList = this.manageService.getRoomStatus();
		JSONArray rentalArr = JSONArray.fromObject(rentalList);
		JSONObject obj = new JSONObject();
		obj.put("rentalArr", rentalArr);
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
	
	//根据楼栋获取房屋状态表中出租以及被选房屋数量以及列表
	@RequestMapping(value = "/getRoomStatusByBuild")
	public JSONArray getRoomStatusByBuild(String build) {
		List rentalList = this.manageService.getRoomStatusByBuild(build);
		JSONArray rentalArr = JSONArray.fromObject(rentalList);
		return rentalArr;
	}
	
	//根据身份证号和公租备案号搜索租房人信息
	@RequestMapping(value = "/searchUser")
	public void searchUser(HttpServletRequest req, HttpServletResponse reponse,Model model){
		String idCard = req.getParameter("idCard");
		String publicRental = req.getParameter("publicRental");
		
		JSONObject json = new JSONObject();		
		//获取选房人信息
		List addList = this.manageService.getUserInfoByIdRental(idCard,publicRental);
		JSONArray jsonArr = JSONArray.fromObject(addList);	
		JSONObject userObject = jsonArr.getJSONObject(0);
		String areaString = userObject.getString("LIMITAREA");
		int area = Integer.parseInt(areaString);
		
		//获取楼栋列表
		List buildingList = this.manageService.getBuilding();
		JSONArray buildingArray = JSONArray.fromObject(buildingList);
		
		//获取第一栋楼
		JSONObject buildObj = buildingArray.getJSONObject(0);
		String build = buildObj.getString("LDH");		
		List roomList = this.manageService.getRoomByBuildArea(build,area);
		JSONArray roomArr = JSONArray.fromObject(roomList);
		
		JSONArray rentalArray = this.getRoomStatusByBuild(build);
		
		json.put("buildingArray", buildingArray);
		json.put("roomArr", roomArr);
		json.put("rentalArray", rentalArray);
		if (jsonArr.size() > 0) {
			JSONObject obj = (JSONObject) jsonArr.get(0);
			String tel = obj.getString("PHONENUM");
			String tel1 = tel.substring(0, 3);
			String tel2 = tel.substring(7);
			obj.put("PHONENUM", tel1 + "****" + tel2);
			String ID = obj.getString("IDCARD");
			String IDCARD1 = ID.substring(0, 6);
			String IDCARD2 = ID.substring(14);
			obj.put("IDCARD", IDCARD1 + "********" + IDCARD2);
			json.put("userInfo", obj);
		}
		try {
			reponse.getWriter().write(String.valueOf(json));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
	
	//根据楼栋和房屋面积限制获取房屋列表
	@RequestMapping(value = "/getRoomByBuild")
	public void getRoomByBuild(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		String build = req.getParameter("build");
		String areaString = req.getParameter("area");
		
		JSONObject obj = new JSONObject();
		
		int area = Integer.parseInt(areaString);
		
		JSONArray rentalArray = this.getRoomStatusByBuild(build);

		obj.put("rentalArray", rentalArray);
		List roomList = this.manageService.getRoomByBuildArea(build, area);
		JSONArray roomArr = JSONArray.fromObject(roomList);
		
		obj.put("roomArr", roomArr);
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
	
	// 获取承租人数量
	@RequestMapping(value = "/chooseRoomPage")
	public String chooseRoomPage(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		return "manage/chooseRoomOnline";
	}
	
	// 获取承租人选房信息管理页面
	@RequestMapping(value = "/applyList")
	public String applyList(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		return "manage/applyList";
	}
	
	//在线选房 选中户
	@RequestMapping(value = "/chooseRoom")
	public void chooseRoom(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		String roomId = req.getParameter("roomId");
		String tenementId = req.getParameter("tenementId");
		String build = req.getParameter("build");
		
		JSONObject obj = new JSONObject();//返回数据用
		
		//得到long类型当前时间
		long l = System.currentTimeMillis();
		Date date = new Date(l);
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateTime = dateFormat.format(date);
		
		List UserChoosedByIdList = this.manageService.getUserChoosedById(tenementId);
		List roomStatus = this.manageService.getRoomstatusByRoomId(roomId);
		if(UserChoosedByIdList.size()>0){
			obj.put("error", "当前用户已选房！");
		}else if(roomStatus.size()>0){
			obj.put("error", "该户已出租或已被选");
		}else{
			this.manageService.chooseRoom(tenementId,roomId,dateTime,"1");	
			List userStatus = this.manageService.searchTenementStatus(tenementId,roomId,"1");
			if(userStatus.size()>0){
				
				obj.put("success", "选房成功！");
			}else{
				obj.put("error", "选房失败！");
			}
		}			
		JSONArray rentalArray = this.getRoomStatusByBuild(build);
		obj.put("rentalArray", rentalArray);
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	
	// 获取承租人数量
	@RequestMapping(value = "/tenantList")
	public String tenantList(HttpServletRequest req, HttpServletResponse reponse, Model model) {		
		int bxList = this.manageService.getTenementCount();
		model.addAttribute("listOfPage", bxList);
		return "pages/tenantList";
	}
	
	// 分页获取承租人信息
	@RequestMapping(value = "/showTenantList")
	public void showTenantList(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String current = req.getParameter("current");
		String limit = req.getParameter("limit");
		
 		int currentNum = Integer.valueOf(current);
 		int limitNum = Integer.valueOf(limit);
 		
		
		List tenantList =  this.manageService.getTenantByPage(currentNum,limitNum);;
		JSONArray jsonArr = JSONArray.fromObject(tenantList);
		
		try {
			PrintWriter pw = reponse.getWriter();
			pw.write(String.valueOf(jsonArr));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
}
