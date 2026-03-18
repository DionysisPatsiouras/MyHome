from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status


def Forbidden_403():
    return Response(
        {"message": "You are not authorized", "status": 403},
        status=status.HTTP_403_FORBIDDEN,
    )

def Not_Found_404():
  return Response(
        {"message": "Data not found", "status": 404},
        status=status.HTTP_404_NOT_FOUND,
    )


def Created_201():
    return Response(
        {"message": "Record created successfully!", "status": 201},
        status=status.HTTP_201_CREATED,
    )


def Updated_200():
    return Response(
        {"message": "Record Updated successfully!", "status": 200},
        status=status.HTTP_200_OK,
    )


def Deleted_202():
    return Response(
        {"message": "Record Deleted successfully!", "status": 202},
        status=status.HTTP_202_ACCEPTED,
    )
