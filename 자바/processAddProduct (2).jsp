<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 <%@ page import="com.oreilly.servlet.*"%>
 <%@ page import="com.oreilly.servlet.multipart.*"%>
 <%@ page import="java.util.*"%>
 <%@ page import="dto.Product" %>
 <%@ page import="dao.ProductRepository" %>
 
 <%
	request.setCharacterEncoding("UTF-8");
 
	String  filename = "";
	String realFolder = "c://upload"; //웹 애플리케이션상의 절대 경로
	int maxSize = 5 * 1024 * 1024; //최대 업로드될 파일의 크기 5MB
	String encType = "UTF-8"; //인코딩 유형
	
	MultipartRequest multi = new MultipartRequest(request, realFolder, 
	maxSize, encType, new DefaultFileRenamePolicy());
 
 	String productId = multi.getParameter("productId");
 	String name = multi.getParameter("name");
 	String unitPrice = multi.getParameter("unitPrice");
 	String description = multi.getParameter("description");
 	String manufacturer = multi.getParameter("manufacturer");
 	String category = multi.getParameter("category");
 	String unitsInStock = multi.getParameter("unitsInStock");
 	String condition = multi.getParameter("condition");
 	
 	Integer price;
 	
 	if (unitPrice.isEmpty())
 		price = 0;
 	else
 		price = Integer.valueOf(unitPrice);
 	
 	long stock;
 	
 	if (unitsInStock.isEmpty())
 		stock = 0;
 	else
 		stock = Long.valueOf(unitsInStock);
 	
 	Enumeration<?> files = multi.getFileNames();
 	String fname = (String) files.nextElement();
 	String fileName = multi.getFilesystemName(fname);
 	
 	ProductRepository dao = ProductRepository.getInstance();
 	
 	Product newProduct = new Product();
 	newProduct.setProductId(productId);
 	newProduct.setPname(name);
 	newProduct.setUnitPrice(price);
 	newProduct.setDescription(description);
 	newProduct.setManufacturer(manufacturer);
 	newProduct.setCategory(category);
 	newProduct.setUnitsInStock(stock);
 	newProduct.setCondition(condition);
 	newProduct.setFilename(fileName);
 	
 	dao.addProduct(newProduct);
 	
 	response.sendRedirect("products.jsp");
 %>
