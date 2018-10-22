package com.clint.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.clint.model.HttpClientUtil;
import com.clint.service.MapService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/manage")
public class manageController {

	@Resource(name = "mapService")
	private MapService mapService;

	@RequestMapping(value = "/index")
	public String index(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		HttpSession session = req.getSession();
		String usr = (String) session.getAttribute("_user_manage");
		model.addAttribute("username", usr);
		return "manage/manageIndex";
	}

	// 用户名
	private static String Uid = "luos890719";

	// 接口安全秘钥
	private static String Key = "d41d8cd98f00b204e980";

	// 获取初始数据
	@RequestMapping(value = "/indexMsg")
	public void indexMsg(HttpServletRequest req, HttpServletResponse reponse) {
		String rentalSql = "";
		String delSql = "";
		delSql = "select distinct * from T_BIM_CHOOSEROOM_STATUS s where s.statusid='3'";
		List delList = this.mapService.getListBySql(delSql);
		JSONArray delJsonArray = JSONArray.fromObject(delList);
		rentalSql = "select distinct c.status,s.*,t.tenementname,r.loudong build,r.jz_household household from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_chooseroom_tenement t,t_bim_room r where r.id=s.roomid and t.id = s.tenementid and c.id=s.statusid and delete_tag='0' and c.status='已被选'";
		List rentalList = this.mapService.getListBySql(rentalSql);
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
		String addSql = "";
		// String ls_conditions=req.getParameter("ls_conditions");*/
		if (StringUtils.hasText(id)) {
			addSql = "select distinct s.id sid,t.tenementname name,t.address,t.idcard,t.phonenum,r.jz_dy dy,r.loudong,r.jz_household household,r.jz_housetype housetype,rt.roominsidearea inside,rt.roomoutsidearea outside from T_BIM_chooseroom_status s,T_BIM_chooseroom_tenement t,T_BIM_room r,t_bim_roomtype rt  where s.id='"
					+ id
					+ "' and delete_tag='0' and r.id=s.roomid and t.id=s.tenementid and r.jz_housetype=rt.roomtypename";
		}
		List addList = this.mapService.getListBySql(addSql);
		JSONArray jsonArr = JSONArray.fromObject(addList);
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
			addSql = "update t_bim_chooseroom_status t set statusid='3' where t.id='" + id + "'";
			this.mapService.execute(addSql);
		}
		String searchSql = "select s.*,t.phonenum,t.tenementname  from t_bim_chooseroom_status s,t_bim_chooseroom_tenement t where s.id='"
				+ id + "' and s.STATUSID='3' and t.id=s.tenementid";
		List searchList = this.mapService.getListBySql(searchSql);
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
		delSql = "select distinct c.status,s.*,t.tenementname,r.loudong build,r.jz_household household from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_chooseroom_tenement t,t_bim_room r where r.id=s.roomid and t.id = s.tenementid and c.id=s.statusid and delete_tag='0' and s.statusid='3'";
		List delList = this.mapService.getListBySql(delSql);
		JSONArray delJsonArray = JSONArray.fromObject(delList);
		rentalSql = "select distinct c.status,s.*,t.tenementname,r.loudong build,r.jz_household household from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_chooseroom_tenement t,t_bim_room r where r.id=s.roomid and t.id = s.tenementid and c.id=s.statusid and delete_tag='0' and c.status='已被选'";
		List rentalList = this.mapService.getListBySql(rentalSql);
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
		String getAllIdString = "select s.id from t_bim_chooseroom_status s where s.statusid='3'";
		List getAllIdList = this.mapService.getListBySql(getAllIdString);
		JSONArray getAllIdArray = JSONArray.fromObject(getAllIdList);
		JSONArray endListArray = new JSONArray();
		for (int i = 0; i < getAllIdArray.size(); i++) {
			String id = ((JSONObject) getAllIdArray.get(i)).getString("ID");
			System.out.println(((JSONObject) getAllIdArray.get(i)).getString("ID"));
			rentalSql = "select distinct s.id sid,t.tenementname name,t.address,t.idcard,t.phonenum,r.jz_dy dy,r.loudong build,r.jz_household household,r.jz_housetype housetype,rt.roominsidearea inside,rt.roomoutsidearea outside from T_BIM_chooseroom_status s,T_BIM_chooseroom_tenement t,T_BIM_room r,t_bim_roomtype rt  where s.id='"
					+ id
					+ "' and s.delete_tag='0' and  s.statusid='3' and r.id=s.roomid and t.id=s.tenementid and r.jz_housetype=rt.roomtypename";
			List rentalList = this.mapService.getListBySql(rentalSql);
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

	// 获取房屋列表
	@RequestMapping(value = "/showRoomStatus")
	public String showRoomStatus(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String addSql = "";
		addSql = "select distinct l.ldh build,r.JZ_HOUSEHOLD household,r.JZ_FLOOR floor,r.id roomId from T_BIM_LDXX l,t_bim_room r where r.loudong=l.ldh and r.jz_housetype!='无'";
		List addList = this.mapService.getListBySql(addSql);
		JSONArray jsonArr = JSONArray.fromObject(addList);

		model.addAttribute("roomAll", jsonArr);
		return "pages/showRoomStatus";
	}

	// 获取房屋状态表中出租以及被选房屋数量以及列表
	@RequestMapping(value = "/getAllRoomStatus")
	public void getAllRoomStatus(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		String chooseSql = "";
		String rentalSql = "";
		rentalSql = "select distinct c.status,s.*,r.loudong from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_room r where  c.id=s.statusid and delete_tag='0' and s.roomid=r.id and (c.status='已出租' or c.status='已被选')";
		List rentalList = this.mapService.getListBySql(rentalSql);
		JSONArray rentalArr = JSONArray.fromObject(rentalList);
		JSONObject obj = new JSONObject();
		obj.put("rentalArr", rentalArr);
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

}
