package com.clint.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.clint.service.ManageService;
import com.clint.service.MapService;

@Service(value = "manageService")
public class ManageServiceImpl implements ManageService {

	@Resource
	private MapService mapService;

	@Override
	public List delList() {
		String delSql = "select distinct * from T_BIM_CHOOSEROOM_STATUS s where s.statusid='3'";
		List res = this.mapService.getListBySql(delSql);
		return res;
	}

	@Override
	public List getRentalAll() {
		String rentalSql = "select distinct c.status,s.*,t.tenementname,r.loudong build,r.jz_household household from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_chooseroom_tenement t,t_bim_room r where r.id=s.roomid and t.id = s.tenementid and c.id=s.statusid and delete_tag='0' and c.status='已被选'";
		List res = this.mapService.getListBySql(rentalSql);
		return res;
	}

	@Override
	public List getUserInfoById(String id) {
		String addSql = "select distinct s.id sid,t.tenementname name,t.address,t.addressdetail,t.housetype thousetype,t.recordtime,t.checkstatus,t.idcard,t.phonenum,r.jz_dy dy,r.loudong,r.jz_household household,r.jz_housetype housetype,rt.roominsidearea inside,rt.roomoutsidearea outside from T_BIM_chooseroom_status s,T_BIM_chooseroom_tenement t,T_BIM_room r,t_bim_roomtype rt  where s.id='"
				+ id
				+ "' and delete_tag='0' and r.id=s.roomid and t.id=s.tenementid and r.jz_housetype=rt.roomtypename";
		List res = this.mapService.getListBySql(addSql);
		return res;
	}

	@Override
	public void updateRoomStatus(String id) {
		String addSql = "update t_bim_chooseroom_status t set statusid='3' where t.id='" + id + "'";
		this.mapService.execute(addSql);		
	}

	@Override
	public List searchRoomById(String id) {
		String searchSql = "select s.*,t.phonenum,t.tenementname  from t_bim_chooseroom_status s,t_bim_chooseroom_tenement t where s.id='"
				+ id + "' and s.STATUSID='3' and t.id=s.tenementid";
		List res = this.mapService.getListBySql(searchSql);
		return res;
	}

	@Override
	public List delAllInfo() {
		String delSql = "select distinct c.status,s.*,t.tenementname,r.loudong build,r.jz_household household from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_chooseroom_tenement t,t_bim_room r where r.id=s.roomid and t.id = s.tenementid and c.id=s.statusid and delete_tag='0' and s.statusid='3'";
		List res = this.mapService.getListBySql(delSql);
		return res;
	}

	@Override
	public List getAllDelInfoId() {
		String getAllIdString = "select s.id from t_bim_chooseroom_status s where s.statusid='3'";
		List res = this.mapService.getListBySql(getAllIdString);
		return res;
	}

	@Override
	public List getRentalInfoById(String id) {
		String rentalSql = "select distinct s.id sid,t.tenementname name,t.address,t.idcard,t.phonenum,r.jz_dy dy,r.loudong build,r.jz_household household,r.jz_housetype housetype,rt.roominsidearea inside,rt.roomoutsidearea outside from T_BIM_chooseroom_status s,T_BIM_chooseroom_tenement t,T_BIM_room r,t_bim_roomtype rt  where s.id='"
				+ id
				+ "' and s.delete_tag='0' and  s.statusid='3' and r.id=s.roomid and t.id=s.tenementid and r.jz_housetype=rt.roomtypename";
		List res = this.mapService.getListBySql(rentalSql);
		return res;
	}

	@Override
	public List getAllRoom() {
		String addSql = "";
		addSql = "select distinct l.ldh build,r.JZ_HOUSEHOLD household,r.JZ_FLOOR floor,r.id roomId from T_BIM_LDXX l,t_bim_room r where r.loudong=l.ldh and r.jz_housetype!='无'";
		List res = this.mapService.getListBySql(addSql) ;
		return res;
	}

	@Override
	public List getRoomStatus() {
		String rentalSql = "";
		rentalSql = "select distinct c.status,s.*,r.loudong from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_room r where  c.id=s.statusid and delete_tag='0' and s.roomid=r.id and (c.status='已出租' or c.status='已被选')";
		List res = this.mapService.getListBySql(rentalSql);
		return res;
	}

	@Override
	public List getUserInfoByIdRental(String idCard, String publicRental) {
		String addSql = "select *  from T_BIM_CHOOSEROOM_TENEMENT r where r.IDCARD='"+ idCard +"' and PUBLIC_RENTAL_RECORD = '"+ publicRental +"'";
		List res = this.mapService.getListBySql(addSql);
		return res;
	}

	@Override
	public List getBuilding() {
		String buildingSql = "select ldh from t_bim_ldxx";
		List res = this.mapService.getListBySql(buildingSql);
		return res;
	}

	@Override
	public List getRoomByBuildArea(String build, int area) {
		String sql = "select distinct t.loudong,t.id id, t.jz_floor floor, t.jz_household houseHold  from T_BIM_ROOM t ,t_bim_roomtype r  where t.loudong='"+ build +"'and t.jz_housetype=r.roomtypename and  to_number(r.roominsidearea) between to_number("+ (area-1) +") and to_number("+ (area+1) +")";
		List res = this.mapService.getListBySql(sql);
		return res;
	}

	@Override
	public void chooseRoom(String tenementId, String roomId, String dateTime,String statusId) {
		String id = UUID.randomUUID().toString().replace("-","");
		String addSql = "insert into t_bim_chooseroom_status (id, roomId, TENEMENTID, time, STATUSID,delete_tag) values ('"+ id +"', '"+ roomId +"', '"+ tenementId +"', '"+ dateTime +"','"+ statusId +"','0')";
		this.mapService.execute(addSql);
		
	}

	@Override
	public List searchTenementStatus(String tenementId, String roomId, String statusId) {
		String sql = "select * from t_bim_chooseroom_status where tenementid='"+ tenementId +"' and roomid='"+ roomId +"' and statusid='"+ statusId +"' and delete_tag='0'";
		List res = this.mapService.getListBySql(sql);
		return res;
	}

	@Override
	public List getUserChoosedById(String tenementId) {
		String addSql = "select t.id from t_bim_chooseroom_status t where delete_tag='0'  and t.TENEMENTID='" + tenementId +"'";
		List addList = this.mapService.getListBySql(addSql);
		return addList;
	}

	@Override
	public List getAllTenement() {
		String sql = "select * from T_BIM_CHOOSEROOM_TENEMENT";
		List res = this.mapService.getListBySql(sql);
		return res;
	}

	@Override
	public void insertTenement(String name, String address, String addressdetail, String idcard, String phonenum,
			String housetype, String housetypeorder, String lotterorder, String recordtime, String optional,
			String checkstatus, String current,String publicrentalrecord,String limitarea) {
		String id =  UUID.randomUUID().toString().replace("-", "");
		String addSql = "insert into T_BIM_CHOOSEROOM_TENEMENT (id,name, address, addressdetail, idcard, phonenum,housetype,housetypeorder,lotterorder,recordtime,optional,checkstatus,current,PUBLIC_RENTAL_RECORD,limitarea) values "+
		"('"+ id +"', '"+ name +"', '"+ address +"', '"+ addressdetail +"','"+ idcard +"','"+ phonenum +"','"+ housetype +"','"+ housetypeorder +"','"+ lotterorder +"','"+ optional +"','"+ checkstatus +"','"+ current +"','"+ publicrentalrecord +"','"+ limitarea +"')";
		this.mapService.execute(addSql);
		
	}

	@Override
	public List getTenantByPage(int currentNum, int limitNum) {
 		String tenantSql = "SELECT * FROM (select e.*,rownum r from (SELECT t.*,rownum FROM T_BIM_CHOOSEROOM_TENEMENT t) e WHERE rownum <= "+ (currentNum)*limitNum +") w WHERE w.r > "+ (currentNum-1)*limitNum ;		
 		List res = this.mapService.getListBySql(tenantSql);
 		return res;
	}

	@Override
	public int getTenementCount() {
		String workerSql = "SELECT COUNT(*) FROM T_BIM_CHOOSEROOM_TENEMENT";
		int res = this.mapService.countAll(workerSql);
		return res;
	}

	@Override
	public List getRoomStatusByBuild(String build) {
		String sql = "select distinct c.status,s.*,r.loudong from T_BIM_CHOOSEROOM_STATUS s,T_BIM_CHOOSEROOM_CODE c,t_bim_room r where  c.id=s.statusid and delete_tag='0' and s.roomid=r.id and (c.status='已出租' or c.status='已被选') and r.loudong='"+ build +"'";
		List res = this.mapService.getListBySql(sql);
		return res;
	}

	@Override
	public List getRoomstatusByRoomId(String roomId) {
		String sql = "select * from T_BIM_CHOOSEROOM_STATUS where roomid='"+ roomId +"' and (statusid='0' or statusid='3') and delete_tag='0'";
		List res = this.mapService.getListBySql(sql);
		return res;
	}

	@Override
	public List getRoomListForRentalByPage(int limitNum,int curNum) {
		String sql = "select * from (select r.*,a.starttime,a.endtime,rownum rn from T_CHOOSEROOM_APPOINT a,T_BIM_ROOM r where a.roomid=r.id and rownum<="+ curNum*limitNum +")  w where w.rn>"+ (curNum-1)*limitNum +"";
		List res = this.mapService.getListBySql(sql);
		return res;
	}

	@Override
	public int getAllRoomCount() {
		int count = this.mapService.countAll("SELECT count(*) FROM T_BIM_ROOM WHERE REGEXP_SUBSTR(JZ_HOUSEHOLD, '^[0-9" + "\\" + "."+"\\" + "-]"+"\\"+ "d*"+"\\" + ".{0,1}"+"\\" + "d*$') IS NOT NULL");
		return count;
	}
	@Override
	public int getAllRoomCountByBuild(String build) {
		int count = this.mapService.countAll("SELECT count(*) FROM T_BIM_ROOM WHERE REGEXP_SUBSTR(JZ_HOUSEHOLD, '^[0-9" + "\\" + "."+"\\" + "-]"+"\\"+ "d*"+"\\" + ".{0,1}"+"\\" + "d*$') IS NOT NULL and loudong='"+ build +"'");
		return count;
	}
	@Override
	public List getRoomListByPage(int limitNum, int currentNum) {
		String sql = "select * from (SELECT i.*,rownum as rn from (SELECT DISTINCT  a.*"+
 " FROM (select DISTINCT r.* from T_BIM_ROOM r  left join T_CHOOSEROOM_APPOINT n on r.id = n.roomid where n.roomid  is null) a,T_BIM_CHOOSEROOM_STATUS s "+
 " WHERE REGEXP_SUBSTR(JZ_HOUSEHOLD, '^[0-9" + "\\" + "."+"\\" + "-]"+"\\"+ "d*"+"\\" + ".{0,1}"+"\\" + "d*$') IS NOT NULL  and (s.DELETE_TAG='0' and a.id!=s.ROOMID and s.statusid='3' or s.statusid='1' )  ) i  where rownum<="+ currentNum*limitNum  +")w  where w.rn>" + (currentNum-1)*limitNum + "";
		List res = this.mapService.getListBySql(sql);
		return res;
	}

	@Override
	public void insertIntoTable(String roomid, String starttime, String endtime) {
		String id = UUID.randomUUID().toString().replace("-", "");
		String sql = "insert into T_CHOOSEROOM_APPOINT(id,roomid,starttime,endtime) values('"+ id +"','"+ roomid +"','"+ starttime +"','"+ endtime +"')";
		this.mapService.execute(sql);
		
	}

	@Override
	public int getRentalRoomCount() {
		String sql = "select count(*) from T_CHOOSEROOM_APPOINT where starttime!='null'";
		int res = this.mapService.countAll(sql);
		
		return res;
	}

	@Override
	public Boolean deleteRentalRoom(String roomid) {
		String sqlString = "delete from T_CHOOSEROOM_APPOINT where roomid='"+ roomid +"'";
		this.mapService.execute(sqlString);
		
		int res = this.mapService.countAll("select count(*) from T_CHOOSEROOM_APPOINT where roomid='"+ roomid +"'");
		Boolean bol = false;
		if(res<=0){
			bol = true;
		}
		return bol;
	}

	@Override
	public List getAllBuild() {
		String sql = "select ldh from T_BIM_LDXX";
		List res = this.mapService.getListBySql(sql);				
		return res;
	}

	@Override
	public List getRoomByBuild(int limitNum, int currentNum, String build) {
		String sql = "select * from (SELECT i.*,rownum as rn from (SELECT DISTINCT  a.*"+
				 " FROM (select DISTINCT r.* from T_BIM_ROOM r  left join T_CHOOSEROOM_APPOINT n on r.id = n.roomid where n.roomid  is null) a,T_BIM_CHOOSEROOM_STATUS s "+
				 " WHERE REGEXP_SUBSTR(JZ_HOUSEHOLD, '^[0-9" + "\\" + "."+"\\" + "-]"+"\\"+ "d*"+"\\" + ".{0,1}"+"\\" + "d*$') IS NOT NULL and loudong='"+ build +"'  and (s.DELETE_TAG='0' and a.id!=s.ROOMID and s.statusid='3' or s.statusid='1' )  ) i  where rownum<="+ currentNum*limitNum  +")w  where w.rn>" + (currentNum-1)*limitNum + "";
						List res = this.mapService.getListBySql(sql);
						return res;
	}
		

}

