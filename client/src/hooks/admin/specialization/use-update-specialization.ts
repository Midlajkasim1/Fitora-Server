import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type { UpdateSpecialization } from "../../type/admin.types";
import api from "../../../api/axios";
import type { UpdateSpecialization } from "../../../type/admin.types";
// import api from "../../api/axios";

export const useUpdateSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSpecialization) => {
      const formData = new FormData();

      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const res = await api.put(
        `/admin/edit-specializations/${data.id}`,
        formData
      );

      return res.data;
    },

    onSuccess: (_,variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-specializations"],
      });
      queryClient.invalidateQueries({ queryKey: ["specialization", variables.id] });
    },
  });
};