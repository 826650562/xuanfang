package com.clint.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.clint.service.MapService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/login")
public class tenementController {

	@Resource(name = "mapService")
	private MapService mapService;

	private String ls_conditions;

	@RequestMapping(value = "/index")
	public String savePerson() {
		return "pages/login";
	}

	// 打开选房页面
	@RequestMapping(value = "/chooseRoom")
	public String chooseRoom(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String public_rental_record = req.getParameter("public_rental_record");
		String limitArea = req.getParameter("limitArea");
		String addSql = "";
		// String ls_conditions=req.getParameter("ls_conditions");*/
		if (StringUtils.hasText(public_rental_record)) {
			addSql = "select t.ldh build from T_BIM_LDXX t";
		}
		List addList = this.mapService.getListBySql(addSql);
		JSONArray jsonArr = JSONArray.fromObject(addList);
		model.addAttribute("limitArea",limitArea);
		model.addAttribute("buildList", jsonArr);
		model.addAttribute("publicRentalRecord",public_rental_record);
		return "pages/chooseRoom";
	}

	// 打开小区详情页面
	@RequestMapping(value = "/communityDstail")
	public String communityDstail() {
		return "pages/communityDstail";
	}

	/* 用户验证 */
	@RequestMapping(value = "/tenement", method = RequestMethod.POST)
	public void tenement(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		// 查询人员
		String tenementname = req.getParameter("tenement");//承租人名
		String public_rental_record = req.getParameter("public_rental_record");//公租备案号

		String addSql = "";
		if (StringUtils.hasText(tenementname) && StringUtils.hasText(public_rental_record)) {
			addSql = "select t.limitarea from t_bim_chooseroom_tenement t where t.phonenum='" + tenementname
					+ "' and t.public_rental_record='" + public_rental_record + "'";
		} 
		List list = this.mapService.getListBySql(addSql);
		JSONArray jsonArray = JSONArray.fromObject(list);
		String submitVerify;
		JSONObject rtns = new JSONObject();
		if (jsonArray.size() > 0) {
			JSONObject obj = (JSONObject) jsonArray.get(0);
			String area = obj.getString("LIMITAREA");
			submitVerify = "用户验证成功！";
			rtns.put("limitArea", area);
			rtns.put("success", submitVerify);

		} else {
			submitVerify = "用户验证失败！";
			rtns.put("error", submitVerify);

		}
		try {
			reponse.getWriter().write(rtns.toString());
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	/* 房屋详情页 */
	@RequestMapping(value = "/roomDetail") // ,method = RequestMethod.POST
	public String roomDetail(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String loudong = req.getParameter("build");// 楼栋号
		String jz_household = req.getParameter("household");// 户号
		String limitArea = req.getParameter("limitArea");
		String publicRentalRecord  =req.getParameter("publicRentalRecord");

		String addSql = "";
		//根据楼栋号户号获取该户的户型等信息
		if (StringUtils.hasText(loudong) && StringUtils.hasText(jz_household)) {
			addSql = "select distinct r.id, r.jz_floor floor,r.loudong build,r.jz_housetype houseType,r.jz_household houseHold,r.jz_dbids from t_bim_room r where r.jz_household='"
					+ jz_household + "' and r.loudong='" + loudong + "'";
		}
		List addrList = this.mapService.getListBySql(addSql);
		JSONArray json = JSONArray.fromObject(addrList);
		
		//获取json数组中的户型楼栋信息
		String HOUSETYPE;
		String BUILD;
		JSONObject temp = (JSONObject) json.get(0);
		String roomId = temp.getString("ID");
		HOUSETYPE = temp.getString("HOUSETYPE");
		HOUSETYPE = HOUSETYPE.replace("反","");
		BUILD = temp.getString("BUILD");
	    int _index = BUILD.indexOf("号");
	    BUILD = BUILD.substring(0,_index);
	    
	    //根据户型获取该户面积信息
		addSql = "select distinct r.roomInsideArea roomInsideArea,r.roomOutsideArea roomOutsideArea,r.description description,r.orientation orientation from t_bim_roomtype r where r.roomTypeName='"
				+ HOUSETYPE + "' and instr(r.specialLouDong, '"+ BUILD +"')>0"; 
		List addList = this.mapService.getListBySql(addSql);		
		if(addList.size()<=0){
			addSql = "select distinct r.roomInsideArea roomInsideArea,r.roomOutsideArea roomOutsideArea,r.description description,r.orientation orientation from t_bim_roomtype r where r.roomTypeName='"
					+ HOUSETYPE + "'";
			addList = this.mapService.getListBySql(addSql);
		}
		JSONArray json2 = JSONArray.fromObject(addList);
		JSONObject roomArea = (JSONObject) json2.get(0);

		//获取房屋状态
		String searchRoomString = "select c.status from t_bim_chooseroom_status s,t_bim_chooseroom_code c  where s.roomid='"+roomId+"' and s.statusid=c.id";
		List statusList = this.mapService.getListBySql(searchRoomString);
		JSONArray statusJson = JSONArray.fromObject(statusList);
		if(statusJson.size()>0){
			JSONObject roomStatus = (JSONObject) statusJson.get(0);
			model.addAttribute("roomStatus",roomStatus);
		}
		
		model.addAttribute("json", json);
		model.addAttribute("roomArea",roomArea);
		model.addAttribute("limitArea",limitArea);
		model.addAttribute("publicRentalRecord",publicRentalRecord);
		return "pages/roomDetail";
	}

	
	
	//选房成功页面
	@RequestMapping(value = "/chooseRoomSuccess")
	public String chooseRoomSuccess(HttpServletRequest req, HttpServletResponse reponse,Model model) {
		String build = req.getParameter("build");//楼栋
		String houseHold = req.getParameter("household");//户号
		String limitArea = req.getParameter("limitArea");
		String publicRentalRecord = req.getParameter("publicRentalRecord");//选房码
		// 楼栋户列表
		String addSql = "";
		List addList;
		JSONObject object;
		String roomId;//户id
		String TENEMENTID;//承租人id
		String STATUSID;//房屋状态id
		String id = UUID.randomUUID().toString();//id
		long time=System.currentTimeMillis();//获取时间戳
		if (StringUtils.hasText(build) && StringUtils.hasText(houseHold) && StringUtils.hasText(publicRentalRecord)) {
			//获取户id
			addSql = "select t.id from T_BIM_ROOM t where t.loudong='" + build + "'and t.jz_household='"+ houseHold +"'";
			addList = this.mapService.getListBySql(addSql);
			JSONArray json = JSONArray.fromObject(addList);
			object = (JSONObject) json.get(0);
			roomId = object.getString("ID");
			
			//获取承租人id
			addSql = "select t.id from t_bim_chooseroom_tenement t where t.PUBLIC_RENTAL_RECORD='" + publicRentalRecord +"'";
			addList = this.mapService.getListBySql(addSql);
			json = JSONArray.fromObject(addList);
			object = (JSONObject) json.get(0);
			TENEMENTID = object.getString("ID");
			
			//获取状态id
			addSql = "select t.id from t_bim_chooseroom_code t where t.STATUS='已被选'";
			addList = this.mapService.getListBySql(addSql);
			json = JSONArray.fromObject(addList);
			object = (JSONObject) json.get(0);
			STATUSID = object.getString("ID");
			
			//查询房屋状态表  判断该用户是否已选房
			addSql = "select t.id from t_bim_chooseroom_status t where delete_tag='0' and t.TENEMENTID='" + TENEMENTID +"'";
			addList = this.mapService.getListBySql(addSql);
			
			json = JSONArray.fromObject(addList);
			if(json.size()>0){
				model.addAttribute("error", "当前用户已选房！");
			}else{
				//房屋状态入库
				addSql = "insert into t_bim_chooseroom_status (id, roomId, TENEMENTID, time, STATUSID,delete_tag) values ('"+ id +"', '"+ roomId +"', '"+ TENEMENTID +"', '"+ time +"','"+ STATUSID +"','0')";
				this.mapService.execute(addSql);
				model.addAttribute("houseHold",houseHold);						
			}			
		}
		model.addAttribute("limitArea",limitArea);
		model.addAttribute("publicRentalRecord",publicRentalRecord);		
		return  "pages/chooseSuccess";
	}
	
	//楼栋房屋列表数据
	@RequestMapping(value = "/buildRoomByList")
	public void buildRoomByList(HttpServletRequest req, HttpServletResponse reponse) {
		String loudong = req.getParameter("loudong");
		String limitArea = req.getParameter("limitArea");
		// 楼栋户列表		
		int area;
		String addSql = "";
		//将面积限制字符串转化为int
		try {
			area= Integer.parseInt(limitArea.trim());			
			if (StringUtils.hasText(loudong)) {
				addSql = "select distinct t.loudong,t.id id, t.jz_floor floor, t.jz_household houseHold  from T_BIM_ROOM t ,t_bim_roomtype r  where t.loudong='"+ loudong +"'and t.jz_housetype=r.roomtypename and  to_number(r.roominsidearea) between to_number("+ (area-1) +") and to_number("+ (area+1) +")";
			}
		} catch (NumberFormatException e) {
		    e.printStackTrace();
		}
		
		List addrList = this.mapService.getListBySql(addSql);
		JSONArray json = JSONArray.fromObject(addrList);
		try {
			reponse.getWriter().write(String.valueOf(json));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
	
	//楼栋房屋状态状态状态状态状态状态状态状态状态状态数据
	@RequestMapping(value = "/roomStatusList")
	public void roomStatusList(HttpServletRequest req, HttpServletResponse reponse) {
		String addSql = "";
		addSql = "select distinct t.roomid,r.status  from t_bim_chooseroom_status t,t_bim_chooseroom_code r where r.id=t.statusid and t.delete_tag='0'";
		List addrList = this.mapService.getListBySql(addSql);
		JSONArray json = JSONArray.fromObject(addrList);
		try {
			reponse.getWriter().write(String.valueOf(json));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
	
	//承租人信息页面
	@RequestMapping(value = "/mine")
	public String mine(HttpServletRequest req, HttpServletResponse reponse,Model model) {
		String publicRentalRecord = req.getParameter("publicRentalRecord");		
		String addSql = "";
		List tenementInfor;
		JSONArray json;
		if(StringUtils.hasText(publicRentalRecord)){
			addSql = "select distinct t.PUBLIC_RENTAL_RECORD, t.id,t.tenementname name,t.phonenum tenementtel,t.limitarea,r.loudong,r.jz_floor floor,r.jz_household household,c.status"+
					"  from t_bim_chooseroom_status s,t_bim_chooseroom_code c,t_bim_chooseroom_tenement t,t_bim_room r "+
					"where t.PUBLIC_RENTAL_RECORD='"+ publicRentalRecord +"'and t.id=s.tenementid and s.statusid=c.id and s.roomid=r.id and s.delete_tag='0'";			
			tenementInfor = this.mapService.getListBySql(addSql);
			json = JSONArray.fromObject(tenementInfor);
			if(json.size()<=0){
				addSql = "select distinct t.PUBLIC_RENTAL_RECORD,t.id,t.tenementname name,t.phonenum tenementtel,t.limitarea"+
						"  from t_bim_chooseroom_tenement t "+
						"where t.PUBLIC_RENTAL_RECORD='"+ publicRentalRecord +"'";
			}
		}
		int deleteCount = this.mapService.countAll("select count(*) from t_bim_chooseroom_status s where t.PUBLIC_RENTAL_RECORD='"+ publicRentalRecord +"");
		int lastCount = 3 - deleteCount;
		tenementInfor = this.mapService.getListBySql(addSql);
		json = JSONArray.fromObject(tenementInfor);	
		JSONObject obj = (JSONObject)json.get(0);
		String tel = obj.getString("TENEMENTTEL");
		String tel1 = tel.substring(0,3);
		String tel2 = tel.substring(7);
		obj.put("TENEMENTTEL",tel1+"****"+tel2);
		obj.put("lastCount",lastCount);
		model.addAttribute("JSONArray",obj);
		return "pages/mine";
	}
	
	//退选
	@RequestMapping(value = "/delChoose")
	public void delChoose(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		String tenementId = req.getParameter("tenementId");
		String delSql = "";
		String searchAql = "";
		
		int count=this.mapService.countAll("select count(*)  from t_bim_chooseroom_status t where delete_tag='1' and t.tenementid='"+ tenementId +"'");
		if(count>=3){
			JSONObject obj = new JSONObject();
			obj.put("delCount", "无法退选！已经退选三次!");
		}else{
			delSql = "update t_bim_chooseroom_status t set delete_tag='1' where  t.tenementid='"+ tenementId +"'";
			this.mapService.execute(delSql);
			searchAql = "select *  from t_bim_chooseroom_status t where t.tenementid='"+ tenementId +"' and delete_tag='0'";
			List searchList = this.mapService.getListBySql(searchAql);
			JSONObject obj = new JSONObject();
			if(searchList.size()<=0){
				obj.put("delSuccess", "退选成功!");
			}else{
				obj.put("delFailed", "退选失败!");
			}
			try {
				reponse.getWriter().write(String.valueOf(obj));
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
		
	}

	
	//例子
//	@RequestMapping(value = "/PeopleByList")
//	public void querylistOfpeople(HttpServletRequest req, HttpServletResponse reponse) {
//		// 查询人员
//		String addSql = "";
//		// String ls_conditions=req.getParameter("ls_conditions");*/
//		if (StringUtils.hasText(ls_conditions)) {
//			addSql = "select * from T_RYXX t where " + ls_conditions;
//		} else {
//			addSql = "select * from T_RYXX t ";
//		}
//		List addrList = this.mapService.getListBySql(addSql);
//		JSONArray json = JSONArray.fromObject(addrList);
//		try {
//			PrintWriter pw = reponse.getWriter();
//			pw.write(String.valueOf(json));
//		} catch (IOException e1) {
//			e1.printStackTrace();
//		}
//	}

}
