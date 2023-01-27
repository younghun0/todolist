import axios from "axios";
import axiosInstance from "../apis/axiosInstance";

export const getData = async (page) => {
  const selectUrl = `/todo?page=${page}`;
  // const selectUrl = "http://localhost:4000/data/";
  const response = await axiosInstance.get(selectUrl);
  return response.data;
};

export async function saveData(saveData) {
  const formData = new FormData();
  formData.append("title", saveData);
  formData.append("isCompleted", false);
  const inserUrl = "/todo";
  const response = await axiosInstance.post(inserUrl, formData);
  return response;
}
export async function modifyData(Data) {
  const formData = new FormData();
  formData.append("title", Data.title);
  formData.append("isCompleted", false);
  const inserUrl = "/todo/" + Data._id;
  const response = await axiosInstance.put(inserUrl, formData);
  return response;
}
export async function removeData(id) {
  const removeUrl = "/todo/" + id;
  const response = await axiosInstance.delete(removeUrl);
  return response;
}
