/*
 * Copyright 2012 Sakai Foundation (SF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var _ = require('underscore');

var NUM_GROUPS_PER_CONTENT = 3;

/**
 * Generates a group_add_users.csv file that provides group membership information that can be used to identify which users can be
 * added to a group, and which user can add them.
 */
module.exports = function(batchNum, model, csvWriter, callback) {
    var rows = [];

    var groupsArray = _.values(model.groups);

    var i = 0;
    _.each(model.content, function(content) {
        var managerId = _getManagerUserId(content);
        var manager = model.users[managerId];
        if (!manager) {
            return;
        }

        var nonViewers = [];
        while (nonViewers.length < NUM_GROUPS_PER_CONTENT) {
            var groupIndex = i % groupsArray.length;
            var nonViewerGroupId = groupsArray[groupIndex].id;
            if (!_.contains(_.union(content.roles.manager.groups, content.roles.viewer.groups), nonViewerGroupId)) {
                nonViewers.push(model.idMapping.groups[nonViewerGroupId]);
            }

            i++;
        }

        var row = [manager.userid, manager.password, model.idMapping.content[content.id]];
        Array.prototype.push.apply(row, nonViewers);
        rows.push(row);
    });

    csvWriter.write('content_add_groups', rows, callback);
};

var _getManagerUserId = function(item) {
    var managerUserId = null;
    _.each(item.roles.manager.users, function(userId) {
        // Don't treat users that belong in both managers and memebrs list as managers
        if (!_.contains(item.roles.viewer.users, userId)) {
            managerUserId = userId;
        }
    });
    return managerUserId;
};
