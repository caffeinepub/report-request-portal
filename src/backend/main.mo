import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

actor {
  type UrgencyLevel = {
    #low;
    #medium;
    #high;
  };

  type Status = {
    #pending;
    #approved;
    #rejected;
    #inDevelopment;
    #completed;
  };

  type ReportRequest = {
    requesterName : Text;
    department : Text;
    businessObjective : Text;
    requiredKPIs : Text;
    dataSource : Text;
    requiredFilters : Text;
    urgencyLevel : UrgencyLevel;
    justification : Text;
    status : Status;
    submissionDate : Time.Time;
    assignedReviewer : ?Principal;
    reviewerComments : ?Text;
  };

  type ReportRequestInput = {
    requesterName : Text;
    department : Text;
    businessObjective : Text;
    requiredKPIs : Text;
    dataSource : Text;
    requiredFilters : Text;
    urgencyLevel : UrgencyLevel;
    justification : Text;
  };

  type ReviewInput = {
    status : Status;
    reviewerComments : ?Text;
    assignedReviewer : ?Principal;
  };

  let requests = Map.empty<Principal, ReportRequest>();

  public shared ({ caller }) func submitRequest(input : ReportRequestInput) : async () {
    if (requests.containsKey(caller)) { Runtime.trap("Request already submitted") };
    let request : ReportRequest = {
      requesterName = input.requesterName;
      department = input.department;
      businessObjective = input.businessObjective;
      requiredKPIs = input.requiredKPIs;
      dataSource = input.dataSource;
      requiredFilters = input.requiredFilters;
      urgencyLevel = input.urgencyLevel;
      justification = input.justification;
      status = #pending;
      submissionDate = Time.now();
      assignedReviewer = null;
      reviewerComments = null;
    };
    requests.add(caller, request);
  };

  public query ({ caller }) func getRequests() : async [ReportRequest] {
    requests.values().toArray();
  };

  public shared ({ caller }) func reviewRequest(user : Principal, input : ReviewInput) : async () {
    let request = switch (requests.get(user)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) { request };
    };
    let updatedRequest : ReportRequest = {
      request with
      status = input.status;
      reviewerComments = input.reviewerComments;
      assignedReviewer = input.assignedReviewer;
    };
    requests.add(user, updatedRequest);
  };
};
