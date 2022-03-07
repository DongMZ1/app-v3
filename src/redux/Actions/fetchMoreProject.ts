import apiRequest from "../../Service/apiRequest";
import produce from "immer";
//fetch more projects, first page of project, designs and quotes only
const fetchMoreProject =
  (
    organizationID: string,
    projects: any,
    options?: { title?: string; page: number }
  ) =>
  async (dispatch: any) => {
    dispatch({
      type: "homePageLoader",
      payload: true,
    });
    const projectRes = await apiRequest({
      url: `/api/fhapp-service/projects/${organizationID}?page=${
        options?.page
      }&limit=20${options?.title ? `&title=${options.title}` : ""}`,
      method: "GET",
    });
    if (projectRes?.success) {
      projects = projects.concat(projectRes.projects);
      dispatch({
        type: "projects",
        payload: projects,
      });
    } else {
      console.log(
        "fetch more project failed, please check fetchMoreProject.tsx"
      );
    }
    dispatch({
      type: "homePageLoader",
      payload: true,
    });
  };

export default fetchMoreProject;
