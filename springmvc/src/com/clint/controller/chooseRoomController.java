package com.clint.controller;

import java.io.IOException;
import java.util.List;
import java.util.Random;
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

import com.clint.model.HttpClientUtil;
import com.clint.service.MapService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/chooseRoom")
public class chooseRoomController {

	@Resource(name = "mapService")
	private MapService mapService;

	// 打开选房页面
	@RequestMapping(value = "/index")
	public String chooseRoom(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		System.out.println(req.getSession().getAttribute("publicRentalRecord"));
		String publicRentalRecord = String.valueOf(req.getSession().getAttribute("publicRentalRecord"));//获取session中的公租备案号
		String addSql = "";
		if (StringUtils.hasText(publicRentalRecord)) {
			addSql = "select t.ldh build from T_BIM_LDXX t";
		}
		List addList = this.mapService.getListBySql(addSql);
		JSONArray jsonArr = JSONArray.fromObject(addList);
		model.addAttribute("buildList", jsonArr);
		return "pages/chooseRoom";
	}

	// 打开小区详情页面
	@RequestMapping(value = "/communityDstail")
	public String communityDstail() {
		return "pages/communityDstail";
	}
	
	/* 房屋详情页 */
	@RequestMapping(value = "/roomDetail") // ,method = RequestMethod.POST
	public String roomDetail(HttpServletRequest req, HttpServletResponse reponse, Model model) {
		String loudong = req.getParameter("build");// 楼栋号
		String jz_household = req.getParameter("household");// 户号
		System.out.println(req.getSession().getAttribute("publicRentalRecord"));
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
		String searchRoomString = "select c.status from t_bim_chooseroom_status s,t_bim_chooseroom_code c  where s.roomid='"+roomId+"' and s.statusid=c.id and delete_tag='0'";
		List statusList = this.mapService.getListBySql(searchRoomString);
		JSONArray statusJson = JSONArray.fromObject(statusList);
		if(statusJson.size()>0){
			JSONObject roomStatus = (JSONObject) statusJson.get(0);
			model.addAttribute("roomStatus",roomStatus);
		}
		
		model.addAttribute("json", json);
		model.addAttribute("roomArea",roomArea);
		return "pages/roomDetail";
	}

	
	
	//选房成功页面
	@RequestMapping(value = "/chooseRoomSuccess")
	public String chooseRoomSuccess(HttpServletRequest req, HttpServletResponse reponse,Model model) {
		String build = req.getParameter("build");//楼栋
		String houseHold = req.getParameter("household");//户号
		String publicRentalRecord = String.valueOf(req.getSession().getAttribute("publicRentalRecord"));//获取session中的公租备案号req.getSession().getAttribute("publicRentalRecord")
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
			addSql = "select t.id from t_bim_chooseroom_status t where delete_tag='0'  and t.TENEMENTID='" + TENEMENTID +"'";
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
		return  "pages/chooseSuccess";
	}
	
	//楼栋房屋列表数据
	@RequestMapping(value = "/buildRoomByList")
	public void buildRoomByList(HttpServletRequest req, HttpServletResponse reponse) {
		String loudong = req.getParameter("loudong");
		String limitArea = String.valueOf(req.getSession().getAttribute("limitArea"));//获取session中的面积限制
		// 楼栋户列表		
		int area;
		String addSql = "";
		if(!limitArea.equals("null")){
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
		}else{
			JSONObject obj = new JSONObject();
			obj.put("overTime", "登录信息超时，请重新登录！");
			try {
				reponse.getWriter().write(String.valueOf(obj));
			} catch (IOException e1) {
				e1.printStackTrace();
			}
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
		String publicRentalRecord = String.valueOf(req.getSession().getAttribute("publicRentalRecord"));//获取session中的公租备案号	
		if(!publicRentalRecord.equals("null")){
			String addSql = "";
			List tenementInfor;
			JSONArray json;
			if(StringUtils.hasText(publicRentalRecord)){
				addSql = "select distinct t.PUBLIC_RENTAL_RECORD, t.id,t.tenementname name,t.phonenum tenementtel,t.limitarea,r.loudong,r.jz_floor floor,r.jz_household household,c.status,s.statusid,rt.roominsidearea area"+
						"  from t_bim_chooseroom_status s,t_bim_chooseroom_code c,t_bim_chooseroom_tenement t,t_bim_room r, T_BIM_ROOMTYPE rt "+
						"where t.PUBLIC_RENTAL_RECORD='"+ publicRentalRecord +"'and t.id=s.tenementid and s.statusid=c.id and s.roomid=r.id and s.delete_tag='0' and (s.statusid='3' or s.statusid='1') and r.jz_housetype=rt.roomtypename";			
				tenementInfor = this.mapService.getListBySql(addSql);
				json = JSONArray.fromObject(tenementInfor);
				if(json.size()<=0){
					addSql = "select distinct t.PUBLIC_RENTAL_RECORD,t.id,t.tenementname name,t.phonenum tenementtel,t.limitarea"+
							"  from t_bim_chooseroom_tenement t "+
							"where t.PUBLIC_RENTAL_RECORD='"+ publicRentalRecord +"'";
				}
			}
			int deleteCount = this.mapService.countAll("select count(*) from t_bim_chooseroom_status s,t_bim_chooseroom_tenement t where t.PUBLIC_RENTAL_RECORD='"+ publicRentalRecord +"' and t.id=s.tenementid and s.delete_tag='1'");
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
		}else{
			model.addAttribute("error","登录信息过时，请重新登录！");
			model.addAttribute("JSONArray","1");
		}

		return "pages/mine";
	}
	
	//退选
	@RequestMapping(value = "/delChoose")
	public void delChoose(HttpServletRequest req, HttpServletResponse reponse) throws IOException {
		String tenementId = req.getParameter("tenementId");
		String delSql = "";
		String searchAql = "";		
		int count=this.mapService.countAll("select count(*)  from t_bim_chooseroom_status t where delete_tag='1' and t.tenementid='"+ tenementId +"'");		
		JSONObject obj = new JSONObject();
		if(count>=3){			
			obj.put("delCount", "已经退选三次!无法退选！");
		}else{			
			String sql = "select * from t_bim_chooseroom_status where t.tenementid='"+ tenementId +"' and t.statusid='3'";
			List choosedList = this.mapService.getListBySql(sql);
			if(choosedList.size()>0){
				obj.put("delFailed", "当前用户选房已通过 禁止退选!");
			}else {
				delSql = "update t_bim_chooseroom_status t set delete_tag='1' where  t.tenementid='"+ tenementId +"' and t.delete_tag='0' and t.statusid='1'";
				this.mapService.execute(delSql);
				searchAql = "select distinct *  from t_bim_chooseroom_status t where t.tenementid='"+ tenementId +"' and t.delete_tag='0' and ( t.statusid='1' or  t.statusid='3')";
				List searchList = this.mapService.getListBySql(searchAql);
				JSONArray arr = JSONArray.fromObject(searchList);
				if(searchList.size()<=0){
					obj.put("delSuccess", "退选成功!");
				}else{
					obj.put("delFailed", "退选失败!");
				}
			}			
		}
		try {
			reponse.getWriter().write(String.valueOf(obj));
		} catch (IOException e1) {
			e1.printStackTrace();
		}		
	}
	
	//获取房屋列表
	@RequestMapping(value = "/showRoomStatus")
	public String showRoomStatus(HttpServletRequest req, HttpServletResponse reponse,Model model){
		String addSql = "";
		addSql = "select distinct l.ldh build,r.JZ_HOUSEHOLD household,r.JZ_FLOOR floor,r.id roomId from T_BIM_LDXX l,t_bim_room r where r.loudong=l.ldh and r.jz_housetype!='无'";
		List addList = this.mapService.getListBySql(addSql);
		JSONArray jsonArr = JSONArray.fromObject(addList);
		
		model.addAttribute("roomAll",jsonArr);
		return "pages/showRoomStatus";
	}
	
	//获取房屋状态表中出租以及被选房屋数量以及列表
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
