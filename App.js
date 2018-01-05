import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    ScrollView

} from 'react-native';

const screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const today = new Date();


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            today_idol: []
        }
    }

    componentDidMount() {
        const xobj = new XMLHttpRequest();
        const that = this;
        xobj.open('POST', 'http://ngdb.iptime.org:765/api/posts/day', true);
        xobj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xobj.onreadystatechange = function () {
            if (xobj.readyState !== 4) {
                return;
            }
            if (xobj.status === 200) {
                let payload = [];
                if(xobj.responseText.search('"log":"그날')!==-1){
                    payload.push({key:[
                        "",
                        "",
                        "아이돌이 없습니다",
                        "/asset/img/x_icon.png",
                        '#777777'
                    ]})
                }
                else{
                    const res = eval(xobj.responseText);
                    for(let i = 0;i<res.length;i++){
                        console.log(res[i]);
                        payload.push({key:[
                            res[i].name,
                            res[i].month+"월 "+res[i].day+"일",
                            where_convert(res[i].where),
                            res[i].img,
                            res[i].color
                        ]})
                    }
                }
                that.setState({
                    today_idol: payload
                })
            } else {
                console.warn('error');
            }
        };
        xobj.send('month=' + (today.getMonth() + 1) + '&day=' + today.getDate() + '&where=[-1]');

        const xobj2 = new XMLHttpRequest();
        xobj2.open('POST', 'http://ngdb.iptime.org:765/api/posts/day_near', true);
        xobj2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xobj2.onreadystatechange = function () {
            if (xobj2.readyState !== 4) {
                return;
            }
            if (xobj2.status === 200) {
                let payload = [];
                const res = eval(xobj2.responseText);
                for(let i = 0;i<res.length;i++){
                    for(let j = 0;j<res[i].length;j++){
                        console.log(res[i][j]);
                        payload.push({key:[
                            res[i][j].name,
                            res[i][j].month+"월 "+res[i][j].day+"일",
                            where_convert(res[i][j].where),
                            res[i][j].img,
                            res[i][j].color
                        ]})
                    }
                }
                that.setState({
                    isLoading: false,
                    soon_idol: payload
                })
            } else {
                console.warn(xobj2.status);
            }
        };
        xobj2.send('month=' + (today.getMonth() + 1) + '&day=' + today.getDate() + '&where=[-1]&index=3');


        const where_convert = (p0)=>{
            switch (p0){
                case 0:
                    return "본가마스";
                case 1:
                    return "밀리마스";
                case 2:
                    return "디어리스타즈";
                case 3:
                    return "신데마스";
                case 4:
                    return "이중소속"
            }
        }

    }

    render() {
        console.log("a"+this.state.soon_idol);
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 50}}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <ScrollView style={styles.mainScroll}>
                <View style={styles.container}>

                    <Text style={styles.UpTitle}>오늘 생일인 아이돌</Text>

                    <FlatList
                        //가로모드
                        style={styles.flatList}
                        horizontal={true}
                        data= {eval(this.state.today_idol)}
                        renderItem={({item}) =>
                            <View style={{
                                width: screen.width-40,
                                height: 450,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: item.key[4]
                            }}>
                                <Image style={styles.idolPic} source={{uri: 'http://ngdb.iptime.org:765/'+item.key[3]}}/>
                                <Text style={styles.idolname}>{item.key[0]}</Text>
                                <Text>{item.key[1]}</Text>
                                <Text>{item.key[2]}</Text>
                            </View>
                        }
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.UpTitle}>곧 생일인 아이돌</Text>
                    <FlatList
                        //가로모드
                        style={styles.flatList}
                        horizontal={true}
                        data= {eval(this.state.soon_idol)}
                        renderItem={({item}) =>
                            <View style={{
                                width: screen.width-40,
                                height: 450,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: item.key[4]
                            }}>
                                <Image style={styles.idolPic} source={{uri: 'http://ngdb.iptime.org:765/'+item.key[3]}}/>
                                <Text style={styles.idolname}>{item.key[0]}</Text>
                                <Text>{item.key[1]}</Text>
                                <Text>{item.key[2]}</Text>
                            </View>
                        }
                    />

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainScroll : {
        marginTop: 50,
    },
    UpTitle : {
        fontSize: 35,
        height: 50
    },
    container: {
        marginTop: (screen.height-550)/2 - 25,
        marginBottom: (screen.height-550)/2 + 25,
        backgroundColor: '#fff',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height: 500
    },
    idolPic: {
        width: 240,
        height: 360,
    },
    flatList: {
        marginHorizontal:20,
        borderRadius:25,
        borderWidth: 0,
    },
    idolname: {
        marginTop:10
    }
});
