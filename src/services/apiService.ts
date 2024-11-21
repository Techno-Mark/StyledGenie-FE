import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    console.log(response);

    if (response.status === 401) {
      // Unauthorized, log out and redirect to login page
      await signOut({ redirect: true, callbackUrl: "/login" });
      throw new Error("Unauthorized. Token missing or expired");
    } else {
      const errorResponse = await response.json();
      const { Message } = errorResponse;
      toast.error(Message);
      throw new Error(Message);
    }
  } else {
    const successResponse = await response.json();
    if (successResponse.ResponseStatus === "failure") {
      toast.error(successResponse?.Message);
      throw new Error(successResponse?.Message);
    }
    return successResponse;
  }
};

export const fetchData = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
    const session = await getSession();

    if (!session || !session?.user) {
      throw new Error("No session or access token found");
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.token}`,
        ...options.headers,
      },
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    // toast.error(error.message);
    throw error;
  }
};

export const get = (endpoint: string) => fetchData(endpoint);

export const unauthorizedPost = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

export const post = (endpoint: string, data: any) =>
  fetchData(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const put = (endpoint: string, data: any) =>
  fetchData(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const del = (endpoint: string) =>
  fetchData(endpoint, {
    method: "DELETE",
  });

export const postFormData = async (endpoint: string, formData: any) => {
  try {
    const session = await getSession();

    if (!session || !session?.user) {
      throw new Error("No session or access token found");
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error("Error fetching data:", error);
    // toast.error(error.message);
    throw error;
  }
};
