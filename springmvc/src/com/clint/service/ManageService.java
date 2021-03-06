package com.clint.service;

import java.util.List;

public interface ManageService {

	// 获取处理过的选房信息
	List delList();

	// 获取未处理的选房信息
	List getRentalAll();

	// 获取承租人信息
	List getUserInfoById(String id);

	// 修改房屋状态
	void updateRoomStatus(String id);

	// 根据房屋id搜索
	List searchRoomById(String id);

	List delAllInfo();

	List getAllDelInfoId();

	List getRentalInfoById(String id);

	List getAllRoom();

	List getRoomStatus();

	List getUserInfoByIdRental(String idCard, String publicRental);

	List getBuilding();

	List getRoomByBuildArea(String build, int area);

	void chooseRoom(String tenementId, String roomId, String dateTime, String statusId);

	List searchTenementStatus(String tenementId, String roomId, String statusId);

	List getUserChoosedById(String tenementId);

	List getAllTenement();

	void insertTenement(String name, String address, String addressdetail, String idcard, String phonenum,
			String housetype, String housetypeorder, String lotterorder, String recordtime, String optional,
			String checkstatus, String current, String publicrentalrecord, String limitarea);

	List getTenantByPage(int currentNum, int limitNum);

	int getTenementCount();

	List getRoomStatusByBuild(String build);

	List getRoomstatusByRoomId(String roomId);

	List getAllTenant();

	Boolean setTenant(String name, String address, String addressdetail, String idcard, String phonenum,
			String housetype, String housetypeorder, String lotterorder, String recordtime, String optional,
			String checkstatus, String current, String publicrentalrecord, String limitarea);

	List getRoomListForRentalByPage(int limitNum, int curNum);

	int getAllRoomCount();

	List getRoomListByPage(int limitNum, int currentNum);

	void insertIntoTable(String roomid);

	int getRentalRoomCount();

	Boolean deleteRentalRoom(String roomid);

	List getAllBuild();

	List getRoomByBuild(int limitNum, int currentNum, String build);

	int getAllRoomCountByBuild(String build);

	Boolean updateTime(String tenementId, String starttime, String endtime);

	List getPersonByPage(int limitNum, int currentNum);

	Boolean delPersonByTenementId(String tenementId);

	int getPersonCount();

	List getRentalOrPerson();

	List getToldPerson();

	List getNoRentalPerson();
}
