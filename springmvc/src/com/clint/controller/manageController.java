package com.clint.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.disk.DiskFileItem;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.clint.model.ExcelOperate;
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
		return "manage/mainframe";
	}
	
	@RequestMapping(value = "/manageIndex")
	public String manageIndex(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		HttpSession session = req.getSession();
		String usr = (String) session.getAttribute("_user_manage");
		model.addAttribute("username", usr);
		return "manage/manageIndex";
	}
	
	// 右边首页
	@RequestMapping(value = "/rightIndex")
	public String rightIndex(HttpServletRequest req, Model model) {
		return "manage/rightIndex";
	}
	
	@RequestMapping(value = "/twoScreen")
	public String twoScreen(HttpServletRequest req, Model model) {
		return "manage/mainframe_2screen";
	}
	
	/*
	 * @RequestMapping(value = "/indextest") public String
	 * indextest(HttpServletRequest req, HttpServletResponse reponse, Model
	 * model) { HttpSession session = req.getSession(); String usr = (String)
	 * session.getAttribute("_user_manage"); model.addAttribute("username",
	 * usr); return "pages/manageIndex"; }
	 */

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

	// 房屋看板页面
	@RequestMapping(value = "/showRoomStatus")
	public String showRoomStatus(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		List addList = this.manageService.getAllRoom();
		JSONArray jsonArr = JSONArray.fromObject(addList);

		model.addAttribute("roomAll", jsonArr);
		return "manage/showRoomStatus";
	}

	// 获取房屋状态表中出租以及被选房屋数量以及列表
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

	// 根据楼栋获取房屋状态表中出租以及被选房屋数量以及列表
	@RequestMapping(value = "/getRoomStatusByBuild")
	public JSONArray getRoomStatusByBuild(String build) {
		List rentalList = this.manageService.getRoomStatusByBuild(build);
		JSONArray rentalArr = JSONArray.fromObject(rentalList);
		return rentalArr;
	}

	// 根据身份证号和公租备案号搜索租房人信息
	@RequestMapping(value = "/searchUser")
	public void searchUser(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String idCard = req.getParameter("idCard");
		String publicRental = req.getParameter("publicRental");

		JSONObject json = new JSONObject();
		// 获取选房人信息
		List addList = this.manageService.getUserInfoByIdRental(idCard, publicRental);
		JSONArray jsonArr = JSONArray.fromObject(addList);
		JSONObject userObject = jsonArr.getJSONObject(0);
		String areaString = userObject.getString("LIMITAREA");
		int area = Integer.parseInt(areaString);

		// 获取楼栋列表
		List buildingList = this.manageService.getBuilding();
		JSONArray buildingArray = JSONArray.fromObject(buildingList);

		// 获取第一栋楼
		JSONObject buildObj = buildingArray.getJSONObject(0);
		String build = buildObj.getString("LDH");
		List roomList = this.manageService.getRoomByBuildArea(build, area);
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

	// 根据楼栋和房屋面积限制获取房屋列表
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

	// 在线选房 选中户
	@RequestMapping(value = "/chooseRoom")
	public void chooseRoom(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		String roomId = req.getParameter("roomId");
		String tenementId = req.getParameter("tenementId");
		String build = req.getParameter("build");

		JSONObject obj = new JSONObject();// 返回数据用

		// 得到long类型当前时间
		long l = System.currentTimeMillis();
		Date date = new Date(l);
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateTime = dateFormat.format(date);

		List UserChoosedByIdList = this.manageService.getUserChoosedById(tenementId);
		List roomStatus = this.manageService.getRoomstatusByRoomId(roomId);
		if (UserChoosedByIdList.size() > 0) {
			obj.put("error", "当前用户已选房！");
		} else if (roomStatus.size() > 0) {
			obj.put("error", "该户已出租或已被选");
		} else {
			this.manageService.chooseRoom(tenementId, roomId, dateTime, "1");
			List userStatus = this.manageService.searchTenementStatus(tenementId, roomId, "1");
			if (userStatus.size() > 0) {

				obj.put("success", "选房成功！");
			} else {
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
		return "manage/tenantList";
	}

	// 获取所有房屋信息
	@RequestMapping(value = "/allRoomList")
	public String allRoomList(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		int roomCout = this.manageService.getAllRoomCount();
		List buildList = this.manageService.getAllBuild();
		JSONArray buildArr = JSONArray.fromObject(buildList);
		model.addAttribute("buildArr", buildArr);
		model.addAttribute("roomCout", roomCout);
		return "manage/allRoomList";
	}

	// 根据楼栋 获取户总数
	@RequestMapping(value = "/getRoomCountByBuild")
	public void getRoomCountByBuild(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String build = req.getParameter("build");
		int roomCout = this.manageService.getAllRoomCountByBuild(build);
		JSONObject obj = new JSONObject();
		obj.put("count", roomCout);
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 通过分页获取房屋信息
	@RequestMapping(value = "/getRoomListByPage")
	public void getRoomListByPage(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String limit = req.getParameter("limit");
		String cur = req.getParameter("cur");
		String build = req.getParameter("build");

		int limitNum = Integer.valueOf(limit);
		int currentNum = Integer.valueOf(cur);

		List roomList = new ArrayList();
		if (StringUtils.hasText(build)) {
			roomList = this.manageService.getRoomByBuild(limitNum, currentNum, build);
		} else {
			roomList = this.manageService.getRoomListByPage(limitNum, currentNum);
		}

		JSONArray roomArr = JSONArray.fromObject(roomList);
		JSONObject obj = new JSONObject();
		obj.put("roomArr", roomArr);
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 通过分页获取房屋信息
	@RequestMapping(value = "/insertIntoTable")
	public void insertIntoTable(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String choosedStr = req.getParameter("choosedStr");
		// String starttime = req.getParameter("starttime");
		// String endtime = req.getParameter("endtime");
		String[] list = choosedStr.split(",");
		for (int i = 0; i < list.length; i++) {
			String roomid = list[i];
			this.manageService.insertIntoTable(roomid);
		}
		JSONObject obj = new JSONObject();
		obj.put("success", "选择预选房成功！");
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 获取所有预租房屋信息
	@RequestMapping(value = "/roomListForRental")
	public String roomListForRental(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		//
		int rentalRoomCount = this.manageService.getRentalRoomCount();
		model.addAttribute("rentalRoomCount", rentalRoomCount);

		return "manage/roomListForRental";
	}

	// 打开预租人员信息页面
	@RequestMapping(value = "/tenantForRentalList")
	public String tenantForRentalList(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		int personCount = this.manageService.getPersonCount();
		model.addAttribute("personCount", personCount);

		return "manage/tenantForRentalList";
	}

	// 分页获取预选房屋信息
	@RequestMapping(value = "/getRoomListForRentalByPage")
	public void getRoomListForRentalByPage(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String current = req.getParameter("current");
		String limit = req.getParameter("limit");

		int currentNum = Integer.valueOf(current);
		int limitNum = Integer.valueOf(limit);

		List roomList = this.manageService.getRoomListForRentalByPage(limitNum, currentNum);
		JSONArray jsonArr = JSONArray.fromObject(roomList);
		JSONObject object = new JSONObject();
		object.put("roomList", roomList);

		try {
			reponse.getWriter().write(String.valueOf(object));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 导入导出excel
	// 导入维修工人excel
	@RequestMapping(value = "/importTenantXls")
	public void importTenantXls(HttpServletRequest req, HttpServletResponse reponse, MultipartFile file)
			throws IOException {
		// List appraiseList = this.homeService.getAppraise();
		JSONObject jobj = new JSONObject();
		if (null != file) {
			String myFileName = file.getOriginalFilename();// 文件原名称
			if (myFileName.endsWith(".xls") || myFileName.endsWith(".xlsx")) {
				CommonsMultipartFile commonsmultipartfile = (CommonsMultipartFile) file;
				DiskFileItem diskFileItem = (DiskFileItem) commonsmultipartfile.getFileItem();
				File files = diskFileItem.getStoreLocation();

				String[][] result = ExcelOperate.getData(files, 1);
				int rowLength = result.length;
				int index = 0;
				while (index < rowLength) {
					// JSONObject ExclObj = (JSONObject)
					// Exclarr.getJSONObject(index);
					Boolean bol = this.manageService.setTenant(String.valueOf(result[index][0]),
							String.valueOf(result[index][1]), String.valueOf(result[index][2]),
							String.valueOf(result[index][3]), String.valueOf(result[index][4]),
							String.valueOf(result[index][5]), String.valueOf(result[index][6]),
							String.valueOf(result[index][7]), String.valueOf(result[index][8]),
							String.valueOf(result[index][9]), String.valueOf(result[index][10]),
							String.valueOf(result[index][11]), String.valueOf(result[index][12]),
							String.valueOf(result[index][13]));
					if (bol) {
						index++;

					} else {
						jobj.put("error", "数据更新失败！");
						break;
					}
				}
				if (index == rowLength && rowLength > 0) {
					jobj.put("success", "数据更新完成！");
				}
			} else {
				jobj.put("error", "请选择xls或xlsx文件");
			}
		}
		try {
			reponse.getWriter().write(String.valueOf(jobj));
		} catch (IOException e) {
			// obj.put("error", "获取评价列表失败！");
			reponse.getWriter().write(String.valueOf(jobj));
			e.printStackTrace();
		}
	}

	// 导出维修工人excel
	@RequestMapping(value = "/exportTenantXLS")
	public void exportWorkerXLS(HttpServletRequest req, HttpServletResponse reponse) throws IOException {

		List superVisorList = this.manageService.getAllTenant();
		JSONArray arr = JSONArray.fromObject(superVisorList);
		JSONObject obj = new JSONObject();
		obj.put("arr", arr);
		try {
			// reponse.getOutputStream();
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e) {

			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/downloadFile")
	public void downloadFile(HttpServletResponse response, HttpServletRequest request) throws Exception {
		String name = request.getParameter("name");
		File f = new File(request.getSession().getServletContext().getRealPath("/xls/") + name);
		if (!f.exists()) {
			response.sendError(404, "File not found!");
			return;
		}
		String fileName = f.getName();
		fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");

		BufferedInputStream br = new BufferedInputStream(new FileInputStream(f));
		byte[] buf = new byte[1024];
		int len = 0;
		response.reset(); // 非常重要
		response.setContentType("application/x-msdownload");
		response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
		OutputStream out = response.getOutputStream();
		while ((len = br.read(buf)) > 0)
			out.write(buf, 0, len);
		br.close();
		out.close();
	}
	// excel部分结束

	// 分页获取承租人信息
	@RequestMapping(value = "/showTenantList")
	public void showTenantList(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String current = req.getParameter("current");
		String limit = req.getParameter("limit");
		JSONObject obj = new JSONObject();
		int currentNum = Integer.valueOf(current);
		int limitNum = Integer.valueOf(limit);

		List tenantList = this.manageService.getTenantByPage(currentNum, limitNum);
		JSONArray tenementArr = JSONArray.fromObject(tenantList);

		List rentalOrPersonList = this.manageService.getRentalOrPerson();
		JSONArray rentalOrPersonArr = JSONArray.fromObject(rentalOrPersonList);

		List toldPerson = this.manageService.getToldPerson();
		JSONArray toldPersonArr = JSONArray.fromObject(toldPerson);

		List noRentalPerson = this.manageService.getNoRentalPerson();
		JSONArray noRentalPersonArr = JSONArray.fromObject(noRentalPerson);

		obj.put("tenementArr", tenementArr);
		obj.put("rentalOrPersonArr", rentalOrPersonArr);
		obj.put("toldPersonArr", toldPersonArr);
		obj.put("noRentalPersonArr", noRentalPersonArr);

		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 删除预选房屋信息
	@RequestMapping(value = "/deleteRentalRoom")
	public void deleteRentalRoom(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String choosedStr = req.getParameter("choosedStr");
		String[] list = choosedStr.split(",");
		int j = 0;
		Boolean bol;
		for (int i = 0; i < list.length; i++) {
			String roomid = list[i];
			bol = this.manageService.deleteRentalRoom(roomid);
			if (bol) {
				j++;
			}
		}
		JSONObject obj = new JSONObject();
		if (j == list.length) {
			obj.put("success", "删除预选房成功！");
		}

		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 设定预选人预选时间
	@RequestMapping(value = "/updataTime")
	public void updataTime(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String choosedStr = req.getParameter("choosedStr");
		String[] list = choosedStr.split(",");
		String starttime = req.getParameter("starttime");
		String endtime = req.getParameter("endtime");

		int j = 0;
		Boolean bol = false;
		for (int i = 0; i < list.length; i++) {
			String tenementId = list[i];
			bol = this.manageService.updateTime(tenementId, starttime, endtime);
			if (bol) {
				j++;
			}
		}
		JSONObject obj = new JSONObject();
		if (j == list.length) {
			obj.put("success", "添加预选时间成功！");
		}

		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 获取已通知选房 未选房预选人列表
	@RequestMapping(value = "/getPersonByPage")
	public void getPersonByPage(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String limit = req.getParameter("limit");
		String curr = req.getParameter("curr");

		int currentNum = Integer.valueOf(curr);
		int limitNum = Integer.valueOf(limit);

		List personlist = this.manageService.getPersonByPage(limitNum, currentNum);
		JSONArray personArr = JSONArray.fromObject(personlist);
		JSONObject obj = new JSONObject();
		obj.put("personArr", personArr);

		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	// 删除预选人员信息
	@RequestMapping(value = "/delPersonByTenementId")
	public void delPersonByTenementId(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String choosedStr = req.getParameter("choosedStr");
		String[] list = choosedStr.split(",");

		int j = 0;
		Boolean bol;
		for (int i = 0; i < list.length; i++) {
			String tenementId = list[i];
			bol = this.manageService.delPersonByTenementId(tenementId);
			if (bol) {
				j++;
			}
		}
		JSONObject obj = new JSONObject();
		if (j == list.length) {
			obj.put("success", "删除预选人员成功！");
		}

		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
}
